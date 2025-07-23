import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, subValue, icon, color = 'primary.main' }) => (
    <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
        <Box sx={{
            mr: 2,
            p: 1.5,
            borderRadius: '50%',
            backgroundColor: color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {icon}
        </Box>
        <Box>
            <Typography color="text.secondary" variant="body2">{title}</Typography>
            <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            {subValue && <Typography variant="caption" color="text.secondary">{subValue}</Typography>}
        </Box>
    </Paper>
);

export default StatCard;