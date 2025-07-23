import React from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{ backgroundColor: 'white', color: 'black', borderBottom: '1px solid #e0e0e0' }}
        >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
                <Typography sx={{ mr: 2 }}>
                    Welcome, {user?.username} ({user?.role})
                </Typography>
                <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;