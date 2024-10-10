import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        User_Name: '',
        User_Password: ''
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
            const res = await axios.post('http://localhost:5000/login', formData);
            alert('Login successful');
            navigate('/dashboard', { state: { username: formData.User_Name } });  // Pass the username to Dashboard
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
                            name="User_Name"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={formData.User_Name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Password"
                            name="User_Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={formData.User_Password}
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
