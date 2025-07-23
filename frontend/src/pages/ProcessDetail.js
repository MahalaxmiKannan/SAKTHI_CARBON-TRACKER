import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Grid, Breadcrumbs, Link, Button } from '@mui/material';
import StatCard from '../components/common/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProcessDetail = () => {
    const { processName } = useParams();
    const navigate = useNavigate();

    // Mock data for the detail view
    const detailData = {
        'Melting': {
            emissions: 3200,
            energy: 3900,
            machines: [
                { name: 'Furnace-1', emissions: 1800, energy: 2100 },
                { name: 'Furnace-2', emissions: 1400, energy: 1800 },
            ],
            shifts: [
                { name: 'Shift A', emissions: 1200 },
                { name: 'Shift B', emissions: 1350 },
                { name: 'Shift C', emissions: 650 },
            ]
        },
    };

    const data = detailData[processName] || { emissions: 0, energy: 0, machines: [], shifts: [] };

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
                Back to Dashboard
            </Button>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{cursor: 'pointer'}}>Dashboard</Link>
                <Typography color="text.primary">{processName} Process</Typography>
            </Breadcrumbs>
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}><StatCard title="Total Emissions" value={`${data.emissions.toLocaleString()} kg CO₂e`} /></Grid>
                <Grid item xs={12} md={4}><StatCard title="Total Energy" value={`${data.energy.toLocaleString()} kWh`} /></Grid>
                <Grid item xs={12} md={4}><StatCard title="Emission Intensity" value={`${(data.emissions / data.energy).toFixed(2)} kg/kWh`} /></Grid>

                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 2, height: 300 }}>
                        <Typography variant="h6">Emissions by Machine</Typography>
                        <ResponsiveContainer><BarChart data={data.machines} layout="vertical" margin={{left: 10}}><YAxis type="category" dataKey="name" /><XAxis type="number" /><Tooltip /><Bar dataKey="emissions" fill="#c62828" /></BarChart></ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 2, height: 300 }}>
                        <Typography variant="h6">Emissions by Shift</Typography>
                        <ResponsiveContainer><BarChart data={data.shifts} margin={{top: 5}}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="emissions" fill="#283593" /></BarChart></ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProcessDetail;