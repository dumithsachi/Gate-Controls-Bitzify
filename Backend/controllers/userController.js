// controllers/userController.js
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const dbConfig = require('../dbConfig');

// Register User
exports.registerUser = async (req, res) => {
    const { User_Id, User_Name, User_Password } = req.body;

    try {
        const pool = await sql.connect(dbConfig);

        // Check if User_Id already exists
        const existingUser = await pool.request()
            .input('User_Id', sql.VarChar, User_Id)
            .query('SELECT * FROM Users WHERE User_Id = @User_Id');

        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ message: 'User ID already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(User_Password, 10);

        // Insert the new user
        await pool.request()
            .input('User_Id', sql.VarChar, User_Id)
            .input('User_Name', sql.VarChar, User_Name)
            .input('User_Password', sql.VarChar, hashedPassword)
            .query('INSERT INTO Users (User_Id, User_Name, User_Password) VALUES (@User_Id, @User_Name, @User_Password)');

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// Get Users
exports.getUsers = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT User_Id, User_Name FROM Users');
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const { User_Id, User_Name, User_Password } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        if (User_Password) {
            const hashedPassword = await bcrypt.hash(User_Password, 10);
            await pool.request()
                .input('User_Id', sql.VarChar, User_Id)
                .input('User_Name', sql.VarChar, User_Name)
                .input('User_Password', sql.VarChar, hashedPassword)
                .query('UPDATE Users SET User_Name = @User_Name, User_Password = @User_Password WHERE User_Id = @User_Id');
        } else {
            await pool.request()
                .input('User_Id', sql.VarChar, User_Id)
                .input('User_Name', sql.VarChar, User_Name)
                .query('UPDATE Users SET User_Name = @User_Name WHERE User_Id = @User_Id');
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const { User_Id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('User_Id', sql.VarChar, User_Id)
            .query('DELETE FROM Users WHERE User_Id = @User_Id');

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { user_name, user_password } = req.body;
    console.log('Request Body:', req.body); 

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('user_name', sql.VarChar, user_name)
            .query('SELECT * FROM Users WHERE user_name = @user_name');

        const user = result.recordset[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(user_password, user.user_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        res.status(200).json({
            message: 'Successfully logged in',
            user: {
                id: user.User_id,
                username: user.user_name,
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};
