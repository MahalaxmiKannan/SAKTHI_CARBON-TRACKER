import React from 'react';
import { Box, Paper, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';

const SupplierPortal = () => (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>Supplier Emission Data Submission</Typography>
            <Typography variant="subtitle1" gutterBottom>Welcome, ABC Steel Corp.</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth><InputLabel>Material Supplied</InputLabel>
                        <Select label="Material Supplied" defaultValue="steel"><MenuItem value="steel">Forging Steel</MenuItem></Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Quantity (Tonnes)" type="number" /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Total Emissions (tCO₂e)" type="number" helperText="Total carbon footprint for this shipment as per your GHG protocol." /></Grid>
                <Grid item xs={12}><TextField fullWidth type="file" helperText="Upload supporting documents (e.g., energy bills, certificates)." /></Grid>
                <Grid item xs={12}><Button variant="contained">Submit Data for Verification</Button></Grid>
            </Grid>
        </Paper>
    </Box>
);

export default SupplierPortal;