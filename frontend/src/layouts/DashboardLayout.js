import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const DashboardLayout = () => {
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <Box
                component="div"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <Header />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        overflowY: 'auto',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;