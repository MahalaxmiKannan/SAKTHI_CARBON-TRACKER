import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

import BarChartIcon from '@mui/icons-material/BarChart';
import ArticleIcon from '@mui/icons-material/Article';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ForestIcon from '@mui/icons-material/Forest';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ScienceIcon from '@mui/icons-material/Science'; // New Icon

const drawerWidth = 240;

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <BarChartIcon /> },
    { name: 'Afforestation', href: '/afforestation', icon: <ForestIcon /> },
    { name: 'Carbon Credits', href: '/credits', icon: <ShowChartIcon /> },
    { name: 'Scenario Planner', href: '/planner', icon: <ScienceIcon /> },
    { name: 'Recommendations', href: '/recommendations', icon: <TipsAndUpdatesIcon /> },
    { name: 'Reports', href: '/reports', icon: <ArticleIcon /> },
];

const Sidebar = () => (
    <Drawer
        variant="permanent"
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                borderRight: '1px solid #e0e0e0'
            },
        }}
    >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                Sakthi Auto
            </Typography>
        </Box>
        <List>
            {navigation.map((item) => (
                <ListItem key={item.name} disablePadding>
                    <ListItemButton
                        component={NavLink}
                        to={item.href}
                        sx={{
                            '&.active': {
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '& .MuiListItemIcon-root': { color: 'white' },
                            },
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Drawer>
);

export default Sidebar;