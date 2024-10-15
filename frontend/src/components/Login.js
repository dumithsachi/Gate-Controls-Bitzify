import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        user_name: '',   // Updated to lowercase
        user_password: ''   // Updated to lowercase
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Hook to navigate

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/login', formData);
            alert('Login successful');
            navigate('/dashboard', { state: { username: formData.user_name } });  // Pass the username to Dashboard
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <Card sx={{ minWidth: 400 }}>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            name="user_name"   // Updated to lowercase
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={formData.user_name}   // Updated to lowercase
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Password"
                            name="user_password"   // Updated to lowercase
                            type="password"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={formData.user_password}   // Updated to lowercase
                            onChange={handleChange}
                            required
                        />
                        {error && (
                            <Typography color="error" variant="body2" gutterBottom>
                                {error}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Log In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
