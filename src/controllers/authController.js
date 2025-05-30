const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail, sendNotification } = require('../utils/email');
const { sendSMS } = require('../utils/sms');
require('dotenv').config();

// Register a new user
exports.register = async (req, res) => {
  const { name, phoneNumber, email, password, role } = req.body;

  // Check all fields are provided
  if (!name || !phoneNumber || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    // Send confirmation email and SMS
    const registrationEmail = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #007bff;">Welcome to Styles Laundry Service!</h2>
                <p>Dear ${name},</p>
                <p>Welcome, as you join styles laundry service ${role}s. We are excited to have you on board.</p>
                <p>If you have any questions, feel free to contact us at any time.</p>
                <p>Best regards,</p>
                <p><strong>Styles Laundry Service Team</strong></p>
            </div>
        `;
    sendNotification(email, 'Registration Successful', registrationEmail);
    sendSMS(
      phoneNumber,
      'Registration Successful. Welcome to Styles laundry service!',
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email }).select('name email');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate a password reset token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send password reset email
    const subject = 'Password Reset';
    const resetEmail = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #007bff;">Password Reset Request</h2>
                <p>Hi ${user.name},</p>
                <p>Please click on the link below to reset your password:</p>
                <a href="${process.env.FRONTEND_BASE_URL}/reset-password/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,</p>
                <p><strong>Styles Laundry Service Team</strong></p>
            </div>
        `;
    sendNotification(user.email, subject, resetEmail);

    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to mail',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

//Logout user
exports.logout = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

//Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, phoneNumber, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, phoneNumber, email, role },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User updated Successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phoneNumber,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

//Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findByIdAndDelete(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
