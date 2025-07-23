import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box, Tabs, Tab, LinearProgress, Switch, FormControlLabel, Autocomplete, TextField } from '@mui/material';
import api from '../api';
import { io } from 'socket.io-client'; // **(Crucial Import for Real-Time)**
import StatCard from '../components/common/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SpeedIcon from '@mui/icons-material/Speed';

// --- Helper Components (No Changes Needed Here) ---

const NetZeroTracker = ({ current, target }) => {
    const progress = Math.min((current / target) * 100, 100);
    const isOnTrack = current <= target;
    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Net Zero 2040 Progress</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>{progress.toFixed(1)}%</Typography>
                <Typography sx={{ ml: 1, color: isOnTrack ? 'success.main' : 'error.main' }}>
                    {isOnTrack ? 'On Track' : 'Behind Target'}
                </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} color={isOnTrack ? 'success' : 'error'} sx={{ height: 10, borderRadius: 5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption">{current.toLocaleString()} T</Typography>
                <Typography variant="caption">Target: {target.toLocaleString()} T</Typography>
            </Box>
        </Paper>
    );
};

const AnalyticsTabs = ({ scopeData, processData, onProcessClick }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const handleProcessClick = (data) => {
        if (onProcessClick && data && data.name) {
            onProcessClick(data.name);
        }
    };
    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} sx={{ mb: 2 }}><Tab label="By Scope" /><Tab label="By Process" /></Tabs>
            <ResponsiveContainer width="100%" height={300}>
                {tabIndex === 0 ? (
                    <PieChart>
                        <Pie data={scopeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {scopeData.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.color} cursor="pointer" />))}
                        </Pie><Tooltip /><Legend />
                    </PieChart>
                ) : (
                    <BarChart data={processData} layout="vertical" margin={{ left: 100 }}>
                        <XAxis type="number" /><YAxis type="category" dataKey="name" width={120} />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} kg CO₂e`} />
                        <Bar dataKey="value" fill="#8884d8" onClick={handleProcessClick} cursor="pointer">
                            {processData.map((entry) => (<Cell key={`cell-${entry.name}`} />))}
                        </Bar>
                    </BarChart>
                )}
            </ResponsiveContainer>
        </Paper>
    );
};

const PartFootprintCalculator = () => {
    const [part, setPart] = useState(null);
    const parts = [{ label: 'Steering Knuckle #XYZ-123', footprint: 15.2 }, { label: 'Crankshaft #ABC-456', footprint: 25.5 }];
    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Part-Level Carbon Footprint</Typography>
            <Autocomplete options={parts} onChange={(e, newVal) => setPart(newVal)} renderInput={(params) => <TextField {...params} label="Select a Part" margin="normal" />} />
            {part && <Box mt={2}><StatCard title={part.label} value={`${part.footprint} kg CO₂e`} color="info.main" /></Box>}
        </Paper>
    );
};

// --- Main Dashboard Component (with Real-Time Logic Restored) ---

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCost, setShowCost] = useState(false);
    const navigate = useNavigate();

    // ** NEW STATE FOR LIVE DATA **
    const [liveNetEmissions, setLiveNetEmissions] = useState(0);

    // ** EFFECT 1: FETCH INITIAL STATIC DATA (RUNS ONCE) **
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/main');
                setData(response.data);
                // Initialize the live KPI with the starting value from the database
                setLiveNetEmissions(response.data.kpis.netEmissions);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ** EFFECT 2: CONNECT TO SOCKET.IO FOR LIVE UPDATES (RUNS ONCE) **
    useEffect(() => {
        const socket = io('http://localhost:5000');

        // Listen for the 'new-emission-data' event from the backend
        socket.on('new-emission-data', (newEmissionData) => {
            // Update the live state variable with the new data
            setLiveNetEmissions(prevEmissions => prevEmissions + newEmissionData.co2e_kg);
        });

        // Disconnect the socket when the component is unmounted to prevent memory leaks
        return () => {
            socket.disconnect();
        };
    }, []); // Empty dependency array ensures this effect runs only once

    const handleProcessDrillDown = (processName) => {
        if (processName === 'Melting') {
             navigate(`/process/${processName}`);
        } else {
            alert(`Drill-down for "${processName}" is not yet implemented.`);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (!data) return <Typography>Could not load dashboard data.</Typography>;

    return (
        <Box>
             <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Dashboard</Typography>
                <FormControlLabel control={<Switch checked={showCost} onChange={(e) => setShowCost(e.target.checked)} />} label="Show Cost of Carbon (₹)" />
            </Box>
            <Grid container spacing={3}>
                <Grid item lg={4} md={6} xs={12}>
                    {/* ** THIS CARD NOW USES THE LIVE STATE VARIABLE ** */}
                    <StatCard
                        title="Net Emissions Today (Live)"
                        value={showCost ? `₹ ${data.kpis.netEmissionsCost.toLocaleString('en-IN')}` : `${liveNetEmissions.toFixed(1)} kg CO₂e`}
                        subValue={showCost ? `Gross Cost: ₹ ${data.kpis.grossEmissionsCost.toLocaleString('en-IN')}` : `Gross: ${data.kpis.grossEmissions.toFixed(1)} kg`}
                        icon={<SpeedIcon/>}
                        color="primary.main"
                    />
                </Grid>
                <Grid item lg={8} md={6} xs={12}>
                    <NetZeroTracker current={data.netZeroTracker.current} target={data.netZeroTracker.target} />
                </Grid>
                <Grid item lg={7} xs={12}>
                    <AnalyticsTabs scopeData={data.scopeBreakdown} processData={data.processBreakdown} onProcessClick={handleProcessDrillDown} />
                </Grid>
                <Grid item lg={5} xs={12}>
                    <PartFootprintCalculator />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;