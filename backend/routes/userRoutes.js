const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserData } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me',  getUserData);


module.exports = router;