import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import useAuth from './hooks/useAuth';

// --- MUI Imports for Theming ---
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// --- Page and Layout Imports ---
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Recommendations from './pages/Recommendations';
import Afforestation from './pages/Afforestation';
import CarbonCredits from './pages/CarbonCredits';
import ScenarioPlanner from './pages/ScenarioPlanner';
import ProcessDetail from './pages/ProcessDetail';
import SupplierLogin from './pages/SupplierLogin';
import SupplierPortal from './pages/SupplierPortal';

// Define a custom theme for Sakthi Auto
const theme = createTheme({
    palette: {
        primary: {
            main: '#2E7D32',
        },
        secondary: {
            main: '#4A90E2',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

// A wrapper for protected routes
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/supplier-login" element={<SupplierLogin />} />

                        {/* Main Protected App Routes */}
                        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="process/:processName" element={<ProcessDetail />} />
                            <Route path="afforestation" element={<Afforestation />} />
                            <Route path="credits" element={<CarbonCredits />} />
                            <Route path="planner" element={<ScenarioPlanner />} />
                            <Route path="recommendations" element={<Recommendations />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Route>

                        {/* Separate Protected Route for Supplier Portal */}
                        <Route path="/supplier-portal" element={<ProtectedRoute><SupplierPortal /></ProtectedRoute>} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;