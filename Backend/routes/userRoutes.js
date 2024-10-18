// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = { registerUser, getUsers, updateUser, deleteUser, loginUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.get('/', getUsers);
router.put('/updateUser', updateUser);
router.delete('/deleteUser/:User_Id', deleteUser);
router.post('/login',loginUser);

module.exports = router;

