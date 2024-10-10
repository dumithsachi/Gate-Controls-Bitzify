import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { styled } from '@mui/system';

// Custom styles
const Sidebar = styled(AppBar)(({ theme }) => ({
    width: '250px',
    height: 'auto',
    backgroundColor: '#387478',  // Updated to your desired color
    padding: '10px',
    boxShadow: '3px 0 5px rgba(0, 0, 0, 0.1)',
    borderRight: '1px solid #ccc'
}));

const NavButton = styled(Button)(({ theme }) => ({
    color: '#fff',
    width: '100%',
    justifyContent: 'flex-start',
    padding: '12px 20px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: '500',
    '&:hover': {
        backgroundColor: '#4f8e8b' // Softer hover effect
    }
}));

const ContentBox = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: '20px',
    backgroundColor: '#eceff1',
    height: '100vh',
    overflowY: 'auto',
    transition: 'background-color 0.5s ease'
}));

const TopBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: '10px 20px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #ccc',
    marginBottom: '20px'
}));

const Dashboard = () => {
    const [showContent, setShowContent] = useState(false);
    const location = useLocation();
    const username = location.state?.username || 'User';

    React.useEffect(() => {
        setTimeout(() => setShowContent(true), 500);
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Sidebar position="static">
                <Toolbar sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="h6" color="inherit" sx={{ mb: 2, fontSize: '28px', fontWeight: 'bold' }}>
                        DASHBOARD
                    </Typography>
                    <NavButton component={Link} to="/dashboard/user-management">
                        User Management
                    </NavButton>
                    <NavButton component={Link} to="/dashboard/card-details">
                        Card Details
                    </NavButton>
                    <NavButton component={Link} to="/dashboard/tower-details">
                        Tower Details
                    </NavButton>
                </Toolbar>
            </Sidebar>

            {/* Main Content Area */}
            <ContentBox>
                {/* Top Bar */}
                <TopBar>
                    <Typography variant="h5" sx={{ color: '#387478', fontWeight: 'bold' }}>
                        Gate Controller
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#37474f' }}>
                        Welcome, {username}
                    </Typography>
                </TopBar>

                {/* Dynamic Content */}
                <Outlet /> {/* This will render the child routes */}
            </ContentBox>
        </Box>
    );
};

export default Dashboard;
