import React from 'react';
import { Container, Box, Paper, Typography, TextField, Button } from '@mui/material';

const SupplierLogin = () => (
    <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
                    Sakthi Auto Supplier Portal
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth label="Supplier ID" autoFocus />
                    <TextField margin="normal" required fullWidth label="Password" type="password" />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Login</Button>
                </Box>
            </Paper>
        </Box>
    </Container>
);

export default SupplierLogin;