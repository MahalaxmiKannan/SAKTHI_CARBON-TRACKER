import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Chip } from '@mui/material';
import { io } from 'socket.io-client';

// --- MUI Icons ---
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

// --- Reusable Components (Defined within this file for simplicity) ---

const severityStyles = {
    warning: { icon: <ReportProblemOutlinedIcon />, color: 'warning.main' },
    critical: { icon: <ReportProblemOutlinedIcon />, color: 'error.main' },
    info: { icon: <LightbulbOutlinedIcon />, color: 'info.main' },
};

const RecommendationCard = ({ rec, onDismiss, onAssign }) => {
    const style = severityStyles[rec.severity] || severityStyles.info;
    const isActionable = !rec.dismissed && !rec.assigned;
    return (
        <Paper
            elevation={isActionable ? 2 : 0}
            sx={{
                p: 2, display: 'flex', alignItems: 'center', gap: 2,
                borderLeft: `4px solid ${style.color}`,
                opacity: isActionable ? 1 : 0.5,
                transition: 'all 0.3s ease-in-out',
                backgroundColor: isActionable ? 'white' : '#f5f5f5',
            }}
        >
            <Avatar sx={{ bgcolor: style.color, color: 'white', width: 48, height: 48, flexShrink: 0 }}>
                {style.icon}
            </Avatar>
            <Box flexGrow={1}>
                <Typography sx={{ fontWeight: 'bold' }}>{rec.title}</Typography>
                <Typography variant="body2" color="text.secondary">{rec.details}</Typography>
            </Box>
            <Box display="flex" gap={1} flexShrink={0}>
                {isActionable && (
                    <>
                        <Button size="small" variant="outlined" onClick={() => onAssign(rec)}>Create Task</Button>
                        <Button size="small" color="secondary" onClick={() => onDismiss(rec.id)}>Dismiss</Button>
                    </>
                )}
                {rec.assigned && <Chip label={`Assigned: ${rec.assigned.to}`} color="primary" />}
                {rec.dismissed && <Chip label="Dismissed" />}
            </Box>
        </Paper>
    );
};

const TaskDialog = ({ open, onClose, rec, onSubmit }) => {
    const [assignTo, setAssignTo] = useState('Maintenance Dept');
    const [dueDate, setDueDate] = useState('');
    if (!rec) return null;
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Task for: "{rec.title}"</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ pt: 1 }}>
                    <Grid item xs={12}><TextField fullWidth label="Assign To" value={assignTo} onChange={(e) => setAssignTo(e.target.value)} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => onSubmit(rec.id, { to: assignTo, due: dueDate })} variant="contained">Assign Task</Button>
            </DialogActions>
        </Dialog>
    );
};

// --- Main Recommendations Page (Now with Live Logic) ---

const Recommendations = () => {
    // State to hold the list of recommendations, now starts empty
    const [recs, setRecs] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRec, setSelectedRec] = useState(null);

    // useEffect hook to handle the real-time Socket.IO connection
    useEffect(() => {
        const socket = io('http://localhost:5000');

        // Listen for 'new-recommendation' events from the server
        socket.on('new-recommendation', (newRecommendation) => {
            console.log('Received new AI recommendation:', newRecommendation);
            // Add the new recommendation to the top of the list
            setRecs(prevRecs => [newRecommendation, ...prevRecs]);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []); // Empty dependency array ensures this runs only once

    // --- State management functions ---
    const handleDismiss = (id) => {
        setRecs(currentRecs =>
            currentRecs.map(r => r.id === id ? { ...r, dismissed: true } : r)
        );
    };

    const handleOpenDialog = (rec) => {
        setSelectedRec(rec);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleAssignTask = (id, task) => {
        setRecs(currentRecs =>
            currentRecs.map(r => r.id === id ? { ...r, assigned: task } : r)
        );
        handleCloseDialog();
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Live AI-Driven Recommendations
            </Typography>
            {recs.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                    <Typography>Listening for real-time recommendations from the AI engine...</Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recs.map((rec) => (
                        <RecommendationCard
                            key={rec.id}
                            rec={rec}
                            onDismiss={handleDismiss}
                            onAssign={handleOpenDialog}
                        />
                    ))}
                </Box>
            )}
            <TaskDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                rec={selectedRec}
                onSubmit={handleAssignTask}
            />
        </Box>
    );
};

export default Recommendations;