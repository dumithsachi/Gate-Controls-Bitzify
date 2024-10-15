import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, IconButton, Divider } from '@mui/material'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Signup = () => {
    const [formData, setFormData] = useState({
        User_Id: '',
        User_Name: '',
        User_Password: ''
    });

    const [users, setUsers] = useState([]); 
    const [editMode, setEditMode] = useState(false); 
    const [currentUserId, setCurrentUserId] = useState(null); 

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editMode) {
                
                await axios.put(`${process.env.REACT_APP_API_URL}/updateUser`, { ...formData, User_Id: currentUserId });
                alert('User updated successfully');
                setEditMode(false);
            } else {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/register`, formData);
                alert(res.data.message);
            }
            setFormData({ User_Id: '', User_Name: '', User_Password: '' });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting form.');
        }
    };

    const handleEdit = (user) => {
        setFormData({
            User_Name: user.User_Name, 
            User_Password: ''
        });
        setCurrentUserId(user.User_Id);
        setEditMode(true);
    };

    const handleDelete = async (User_Id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/deleteUser/${User_Id}`);
            alert('User deleted successfully');
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user', err);
        }
    };

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#e0f7fa', minHeight: '100vh' }}> 
            
            {/* Add User Section */}
            <Box
                sx={{
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom sx={{ color: '#00796b', fontWeight: 'bold', textAlign: 'left' }}>
                    {editMode ? 'Update User' : 'Add User'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', gap: 2 }}> 
                        {!editMode && (
                            <TextField
                                label="User Id"
                                name="User_Id"
                                variant="outlined"
                                value={formData.User_Id}
                                onChange={handleChange}
                                required
                                sx={{ flex: 1 }}
                            />
                        )}
                        <TextField
                            label="Username"
                            name="User_Name"
                            variant="outlined"
                            value={formData.User_Name}
                            onChange={handleChange}
                            required
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Password"
                            name="User_Password"
                            type="password"
                            variant="outlined"
                            value={formData.User_Password}
                            onChange={handleChange}
                            sx={{ flex: 1 }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ width: '150px' }} 
                        >
                            {editMode ? 'Update User' : 'Add User'}
                        </Button>
                    </Box>
                </form>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Current Users Section */}
            <Box
                sx={{
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ color: '#00796b', fontWeight: 'bold', textAlign: 'left' }}>
                    Current Users
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>User ID</strong></TableCell>
                                <TableCell><strong>Username</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.User_Id}>
                                    <TableCell>{user.User_Id}</TableCell>
                                    <TableCell>{user.User_Name}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEdit(user)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(user.User_Id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Signup;
