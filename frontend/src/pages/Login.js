import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Container, Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await auth.login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid username or password.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
                        Sakthi Auto Emissions Dashboard
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal" required fullWidth id="username" label="Username" name="username"
                            autoComplete="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal" required fullWidth name="password" label="Password" type="password"
                            id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Login
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;