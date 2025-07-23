const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// This endpoint will provide all the necessary data for the main dashboard in one call.
router.get('/main', protect, async (req, res) => {
    try {
        const grossEmissions = 5850.5; // kg CO2e for the day
        const totalOffset = 350.2; // kg CO2e from afforestation/solar

        // --- NEW: COST DATA ---
        const costPerKwh = 8.5; // ₹8.5 per kWh
        const electricityKwh = 4120.4 / 0.82; // Reverse calculating kWh from CO2e for simulation
        const electricityCost = electricityKwh * costPerKwh;
        const fuelCost = 5000; // Simulated cost for diesel/LPG
        const grossCost = electricityCost + fuelCost;

        const dashboardData = {
            // 1. KPIs
            kpis: {
                netEmissions: grossEmissions - totalOffset,
                grossEmissions: grossEmissions,
                totalOffset: totalOffset,
                // --- NEW ---
                netEmissionsCost: grossCost, // Net cost for now, could subtract credit value later
                grossEmissionsCost: grossCost,
            },
            // 2. Net Zero Tracker
            netZeroTracker: {
                target: 2500000, // Annual target in Tonnes
                current: 1850000, // Current annual emissions in Tonnes
            },
            // 3. Scope Breakdown
            scopeBreakdown: [
                { name: 'Scope 1', value: 1230.1, color: '#f44336' }, // Direct (Diesel, LPG)
                { name: 'Scope 2', value: 4120.4, color: '#ff9800' }, // Indirect (Electricity)
                { name: 'Scope 3', value: 500.0, color: '#2196f3' },  // Other (Supply Chain, Waste)
            ],
            // 4. Monthly Analytics (for the current year)
            monthlyAnalytics: [
                { month: 'Jan', emissions: 210, target: 220 },
                { month: 'Feb', emissions: 195, target: 210 },
                { month: 'Mar', emissions: 205, target: 215 },
                { month: 'Apr', emissions: 220, target: 225 },
                { month: 'May', emissions: 215, target: 220 },
                { month: 'Jun', emissions: 230, target: 230 },
            ],
            // 5. Process-wise Breakdown
            processBreakdown: [
                { name: 'Melting', value: 3200 },
                { name: 'CNC Machining', value: 1100 },
                { name: 'Heat Treatment', value: 750 },
                { name: 'Dispatch Logistics', value: 400 },
                { name: 'Paint Booth', value: 250 },
                { name: 'Other', value: 150.5 },
            ],
            // 6. Afforestation Board
            afforestation: {
                treesPlanted: 15230,
                co2Sequestered: 320, // Tonnes per year
                areaCovered: 45, // Acres
            },
        };

        res.json(dashboardData);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;