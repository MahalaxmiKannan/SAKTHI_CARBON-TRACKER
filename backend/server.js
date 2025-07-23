const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const CalculatedEmission = require('./models/CalculatedEmission');
require('dotenv').config();

// --- Route Imports ---
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');
const carbonCreditRoutes = require('./routes/carbonCredits');

// --- Emission Factors ---
const GRID_EMISSION_FACTOR_IN = 0.82;
const DIESEL_EMISSION_FACTOR = 2.68;

// --- App & Server Setup ---
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// --- Connect to Database ---
connectDB();

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/credits', carbonCreditRoutes);

// Serve generated reports statically
app.use('/reports', express.static(path.join(__dirname, 'public/reports')));

// API endpoint to ingest raw sensor data
app.post('/api/ingest', async (req, res) => {
  const { sensor_id, value, unit, department } = req.body;
  if (!sensor_id || value === undefined || !unit || !department) {
    return res.status(400).json({ msg: 'Bad Request: Missing required fields' });
  }

  let co2e_kg = 0;
  let scope = '';

  if (unit === 'kWh') {
    scope = 'Scope 2';
    co2e_kg = value * GRID_EMISSION_FACTOR_IN;
  } else if (unit === 'liter_diesel') {
    scope = 'Scope 1';
    co2e_kg = value * DIESEL_EMISSION_FACTOR;
  } else {
    return res.status(400).json({ msg: 'Unsupported unit type' });
  }

  try {
    const newEmission = new CalculatedEmission({
      source_id: sensor_id,
      department,
      scope,
      co2e_kg,
    });
    await newEmission.save();
    io.emit('new-emission-data', newEmission);
    res.status(201).json(newEmission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// API endpoint for initial dashboard summary
app.get('/api/emissions/summary', async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const totalToday = await CalculatedEmission.aggregate([
            { $match: { timestamp: { $gte: startOfDay } } },
            { $group: { _id: null, total: { $sum: '$co2e_kg' } } }
        ]);
        const byDepartment = await CalculatedEmission.aggregate([
            { $match: { timestamp: { $gte: startOfDay } } },
            { $group: { _id: '$department', total: { $sum: '$co2e_kg' } } },
            { $sort: { total: -1 } }
        ]);
        const recentEmissions = await CalculatedEmission.find().sort({ timestamp: -1 }).limit(20);
        res.json({
            totalToday: totalToday.length > 0 ? totalToday[0].total : 0,
            byDepartment,
            recentEmissions: recentEmissions.reverse(),
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Socket.IO Connection Handler ---
io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});


// =====================================================================
// --- AI RECOMMENDATION SIMULATOR (NEWLY ADDED) ---
// This section simulates a real-time AI engine generating insights.
// =====================================================================

const recommendationTemplates = [
    { type: 'Anomaly', severity: 'warning', template: "Energy spike detected in {subject}. Consumption is 25% above the 7-day average for this time." },
    { type: 'Anomaly', severity: 'critical', template: "Unusually high standby power consumption for {subject}. Check for shutdown procedure failures." },
    { type: 'Optimization', severity: 'info', template: "Process data suggests a 5% efficiency gain is possible for {subject} by adjusting cycle time." },
    { type: 'Anomaly', severity: 'warning', template: "Coolant pump for {subject} is running outside of production hours. Investigate potential leaks or timer issues." },
];
const recommendationSubjects = ['Furnace-1 (Melting)', 'CNC Machine-10 (Machining)', 'Shot Blasting Unit', 'Paint Booth Blower', 'Air Compressor 2'];

const generateRecommendation = () => {
    const template = recommendationTemplates[Math.floor(Math.random() * recommendationTemplates.length)];
    const subject = recommendationSubjects[Math.floor(Math.random() * recommendationSubjects.length)];
    return {
        id: Date.now(),
        type: template.type,
        title: template.template.replace('{subject}', subject),
        details: `This event was flagged by the automated monitoring system at ${new Date().toLocaleTimeString()}. Please investigate and assign a task or dismiss the alert.`,
        severity: template.severity,
        timestamp: new Date(),
    };
};

// Use an interval to broadcast a new recommendation every 15 seconds
setInterval(() => {
    const recommendation = generateRecommendation();
    io.emit('new-recommendation', recommendation);
    console.log('AI SIM: Emitted new recommendation ->', recommendation.title);
}, 15000);


// --- Start the Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend server active on port ${PORT}`));