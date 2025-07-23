import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../api';
import StatCard from '../components/common/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

// --- MUI Icons ---
import ForestIcon from '@mui/icons-material/Forest';
import Co2Icon from '@mui/icons-material/Co2';
import ParkIcon from '@mui/icons-material/Park';

const Afforestation = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We can reuse the main dashboard endpoint for this prototype
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/main');
                setData(response.data.afforestation);
            } catch (error) {
                console.error("Failed to fetch afforestation data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Simulated extra data for this page
    const plantingHistory = [
        { year: 2021, trees: 3500 },
        { year: 2022, trees: 4200 },
        { year: 2023, trees: 5100 },
        { year: 2024, trees: 2430 },
    ];
    const siteData = [
        { name: 'Coimbatore Site A', area: 25, trees: 8500, status: 'Mature' },
        { name: 'Erode Site B', area: 15, trees: 5230, status: 'Growing' },
        { name: 'Tiruppur Site C', area: 5, trees: 1500, status: 'New' },
    ];

    if (loading) return <Typography>Loading...</Typography>;
    if (!data) return <Typography>Could not load data.</Typography>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Afforestation Initiative</Typography>
            <Grid container spacing={3}>
                {/* --- Row 1: KPIs --- */}
                <Grid item lg={4} md={12} xs={12}>
                    <StatCard title="Total Trees Planted" value={data.treesPlanted.toLocaleString()} icon={<ForestIcon />} color="#2e7d32" />
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                    <StatCard title="CO₂ Sequestered Annually" value={`${data.co2Sequestered} Tonnes`} icon={<Co2Icon />} color="#66bb6a" />
                </Grid>
                <Grid item lg={4} md={6} xs={12}>
                    <StatCard title="Total Area Covered" value={`${data.areaCovered} Acres`} icon={<ParkIcon />} color="#a5d6a7" />
                </Grid>

                {/* --- Row 2: Planting History Chart (Now Full Width) --- */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Planting History by Year</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart
                                data={plantingHistory}
                                // CHANGE 1: Added margin for better spacing of labels
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                {/* CHANGE 2: Added a grid for better readability */}
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => value.toLocaleString()} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    // CHANGE 3: Custom formatter for a cleaner tooltip
                                    formatter={(value) => [value.toLocaleString(), 'Trees Planted']}
                                    cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="trees"
                                    fill="#2e7d32"
                                    name="Trees Planted"
                                    // CHANGE 4: Explicitly set a larger bar size
                                    barSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* --- Row 3: Planting Sites Table (Now Full Width) --- */}
                 <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                         <Typography variant="h6" gutterBottom sx={{p: 1}}>Planting Sites Overview</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                                        <TableCell>Site Location</TableCell>
                                        <TableCell align="right">Area (Acres)</TableCell>
                                        <TableCell align="right">Trees Planted</TableCell>
                                        <TableCell align="right">Current Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {siteData.map(row => (
                                        <TableRow key={row.name} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">{row.name}</TableCell>
                                            <TableCell align="right">{row.area.toLocaleString()}</TableCell>
                                            <TableCell align="right">{row.trees.toLocaleString()}</TableCell>
                                            <TableCell align="right">{row.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Afforestation;