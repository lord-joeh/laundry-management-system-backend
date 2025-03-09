const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for password reset
router.post('/reset-password', authController.resetPassword);

// Route for password reset
router.post('/forgot-password', authController.forgotPassword);

//Route for user logout
router.get('/logout', authController.logout);

module.exports = router;