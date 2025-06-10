const express = require('express');
const router = express.Router();
const {
  register,
  login,
  resetPassword,
  forgotPassword,
  logout,
  updateUser,
  deleteUser,
  changePassword,
  getAllUsers,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

//Route to get all users
router.get('/', authenticate, getAllUsers);

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for password reset
router.post('/reset-password', authenticate, resetPassword);

// Route for password reset
router.post('/forgot-password', forgotPassword);

//Route to change password
router.post('/change-password', authenticate, changePassword);

//Route for user update
router.put('/:id', authenticate, updateUser);

//Route for user logout
router.post('/logout', authenticate, logout);

//Route to delete user
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
