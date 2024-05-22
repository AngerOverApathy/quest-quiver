// Desc: User Controller
// Path: backend/controllers/userController.js
// Access: Public
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const userController = {

  // Helper function to set token in cookie
  setTokenCookie: (res, token) => {
    const cookieOptions = {
      httpOnly: true, // The cookie cannot be accessed or manipulated in the client-side JavaScript
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Cookie expiration set to 30 days
      secure: process.env.NODE_ENV !== 'development', // Secure flag set in production only; ensures cookie is sent over HTTPS
      sameSite: 'strict' // Strict sameSite setting to prevent CSRF
    };
    res.cookie('token', token, cookieOptions); // Set a cookie named 'token'
  },

  // Generate a JSON Web Token
  generateToken: (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  },

  // Register a new user
  registerUser: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Please fill all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, email, password: hashedPassword });

    if (user) {
      const token = userController.generateToken(user._id);
      userController.setTokenCookie(res, token);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  }),

  // Log in an existing user
  loginUser: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = userController.generateToken(user._id);
      userController.setTokenCookie(res, token);
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  }),

  // Retrieve data for the logged-in user
  getUserData: asyncHandler(async (req, res) => {
    const { _id, username, email } = await User.findById(req.user.id);
    res.status(200).json({ id: _id, username, email });
  })
};

module.exports = userController;