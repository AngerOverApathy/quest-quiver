// Desc: User Controller
// Path: backend/controllers/userController.js
// Access: Public
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req, res) => {
    res.json({ message: 'Register User' });
});

const loginUser = asyncHandler(async (req, res) => {
    res.json({ message: 'Login User' });
});

const getUserData = asyncHandler(async (req, res) => {
    res.json({ message: 'Get User Data' });
})






module.exports = {
    registerUser,
    loginUser,
    getUserData
}