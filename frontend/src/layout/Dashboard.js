import React from 'react';
import { Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button, Typography } from '@mui/material';

const Dashboard = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="static" sx={{ width: '200px', height: '100vh', backgroundColor: '#2c3e50' }}>
                <Toolbar sx={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px' }}>
                    <Typography variant="h6" color="inherit" sx={{ mb: 2 }}>
                        Dashboard
                    </Typography>
                    <Button component={Link} to="/user-management" sx={{ color: '#fff', mb: 2 }}>
                        User Management
                    </Button>
                    <Button component={Link} to="/card-details" sx={{ color: '#fff' }}>
                        Card Details
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4">Welcome to the Dashboard</Typography>
                {/* Add more dashboard content here */}
            </Box>
        </Box>
    );
};

export default Dashboard;
