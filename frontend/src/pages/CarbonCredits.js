import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import api from '../api';
import StatCard from '../components/common/StatCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const CarbonCredits = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/credits/summary');
                setData(response.data);
            } catch (error) { console.error("Failed to fetch carbon credit data:", error); }
            finally { if(loading) setLoading(false); }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [loading]);

    if (loading) return <Typography>Loading...</Typography>;
    if (!data) return <Typography>Could not load data.</Typography>;

    const isGain = data.kpis.unrealizedGain >= 0;

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Carbon Credit Portfolio</Typography>
            <Grid container spacing={3}>
                <Grid item md={4} xs={12}><StatCard title="Portfolio Market Value" value={`$${data.kpis.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<AccountBalanceWalletIcon />} color="primary.main" /></Grid>
                <Grid item md={4} xs={12}><StatCard title="Live Market Price" value={`$${data.kpis.marketPrice.toFixed(2)}`} subValue="per credit" icon={<PriceChangeIcon />} color="secondary.main" /></Grid>
                <Grid item md={4} xs={12}><StatCard title="Unrealized Gain / Loss" value={`${isGain ? '+' : ''}$${data.kpis.unrealizedGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={isGain ? <TrendingUpIcon /> : <TrendingDownIcon />} color={isGain ? 'success.main' : 'error.main'} /></Grid>
                <Grid item lg={7} xs={12}>
                    <Paper elevation={3} sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Market Price Trend (Today)</Typography>
                        <ResponsiveContainer width="100%" height="90%"><LineChart data={data.marketTrend}><XAxis dataKey="time" /><YAxis domain={['dataMin - 0.1', 'dataMax + 0.1']} /><Tooltip formatter={(value) => `$${value.toFixed(2)}`} /><Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} /></LineChart></ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item lg={5} xs={12}>
                    <Paper elevation={3} sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Transaction History</Typography>
                        <TableContainer><Table size="small"><TableHead><TableRow><TableCell>Date</TableCell><TableCell>Type</TableCell><TableCell align="right">Quantity</TableCell></TableRow></TableHead>
                            <TableBody>{data.transactionHistory.map(row => (<TableRow key={row.id}><TableCell>{row.date}</TableCell><TableCell><Chip label={row.type} size="small" color={row.type === 'Purchase' ? 'success' : 'info'} variant="outlined" /></TableCell><TableCell align="right">{row.quantity.toLocaleString()}</TableCell></TableRow>))}</TableBody>
                        </Table></TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CarbonCredits;