const express = require('express');
const router = express.Router();
const { register, login, resetPassword, forgotPassword, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for password reset
router.post('/reset-password', authenticate, resetPassword);

// Route for password reset
router.post('/forgot-password', forgotPassword);

//Route for user logout
router.get('/logout', authenticate, logout);

module.exports = router;