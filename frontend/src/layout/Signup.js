import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        User_Id: '',
        User_Name: '',
        User_Password: ''
    });

    const [users, setUsers] = useState([]); // State to store the users
    const [editMode, setEditMode] = useState(false); // For update mode
    const [currentUserId, setCurrentUserId] = useState(null); // Store the User_Id being edited

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/users');
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
                // Update user
                await axios.put('http://localhost:5000/updateUser', { ...formData, User_Id: currentUserId });
                alert('User updated successfully');
                setEditMode(false);
            } else {
                // Add new user
                const res = await axios.post('http://localhost:5000/register', formData);
                alert(res.data.message);
            }
            setFormData({ User_Id: '', User_Name: '', User_Password: '' });
            fetchUsers();
        } catch (err) {
            alert(err.response.data.message);
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
            await axios.delete(`http://localhost:5000/deleteUser/${User_Id}`);
            alert('User deleted successfully');
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user', err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>{editMode ? 'Update User' : 'Add User'}</h1>
                {!editMode && (
                    <input 
                        type="text" 
                        name="User_Id" 
                        placeholder="User Id" 
                        value={formData.User_Id} 
                        onChange={handleChange} 
                        required
                    />
                )}
                <input 
                    type="text" 
                    name="User_Name" 
                    placeholder="Username" 
                    value={formData.User_Name} 
                    onChange={handleChange} 
                    required
                />
                <input 
                    type="password" 
                    name="User_Password" 
                    placeholder="Password" 
                    value={formData.User_Password} 
                    onChange={handleChange} 
                />
                <button type="submit">{editMode ? 'Update User' : 'Add User'}</button>
            </form>

            <h2>Current Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.User_Id}>
                            <td>{user.User_Id}</td>
                            <td>{user.User_Name}</td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Edit</button>
                                <button onClick={() => handleDelete(user.User_Id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Signup;
