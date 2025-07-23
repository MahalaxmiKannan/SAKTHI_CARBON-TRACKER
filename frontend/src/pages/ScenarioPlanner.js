import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Slider, TextField, InputAdornment } from '@mui/material';
import StatCard from '../components/common/StatCard';
import SavingsIcon from '@mui/icons-material/Savings';
import Co2Icon from '@mui/icons-material/Co2';

const ScenarioPlanner = () => {
    const [idleReduction, setIdleReduction] = useState(15);
    const [efficiencyGain, setEfficiencyGain] = useState(20);
    const [results, setResults] = useState({ co2: 0, cost: 0 });

    useEffect(() => {
        // Simple mock calculation logic
        const baseEmissions = 5000000; // kg
        const baseCost = 15000000; // ₹
        const idleImpact = (idleReduction / 100) * 0.2; // Assume idle time is 20% of impact
        const efficiencyImpact = (efficiencyGain / 100) * 0.3; // Assume new machine is 30% of impact
        const totalReduction = idleImpact + efficiencyImpact;

        setResults({
            co2: baseEmissions * totalReduction,
            cost: baseCost * totalReduction,
        });
    }, [idleReduction, efficiencyGain]);

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Scenario Planner</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography gutterBottom>If we reduce furnace idle time by <strong>{idleReduction}%</strong>...</Typography>
                        <Slider value={idleReduction} onChange={(e, val) => setIdleReduction(val)} step={5} marks min={0} max={50} />

                        <Typography gutterBottom sx={{ mt: 4 }}>If we replace Furnace-A with a model that is <strong>{efficiencyGain}%</strong> more efficient...</Typography>
                        <Slider value={efficiencyGain} onChange={(e, val) => setEfficiencyGain(val)} step={5} marks min={0} max={50} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6">Projected Annual Impact</Typography>
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12}><StatCard title="Projected CO₂ Reduction" value={`${(results.co2 / 1000).toLocaleString()} Tonnes`} icon={<Co2Icon />} color="success.main" /></Grid>
                            <Grid item xs={12}><StatCard title="Projected Cost Savings" value={`₹ ${results.cost.toLocaleString('en-IN')}`} icon={<SavingsIcon />} color="info.main" /></Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ScenarioPlanner;