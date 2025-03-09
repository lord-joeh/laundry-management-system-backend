const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail, sendNotification } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

// Register a new user
exports.register = async (req, res) => {
    const { name, phoneNumber, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, phoneNumber, email, password: hashedPassword });
        await newUser.save();

        // Send confirmation email and SMS
        sendNotification(email, 'Registration Successful', 'Welcome to our laundry service!');
        // sendSMS(phoneNumber, 'Registration Successful. Welcome to our laundry service!');

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await User
            .findOne({ email })
            .select('name email');
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a password reset token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send password reset email
        const subject = 'Password Reset';
        const text = `Hi ${user.name},\n\nPlease click on the link below to reset your password:\n\nhttp://localhost:3000/reset-password/${token}\n\nIf you did not request a password reset, please ignore this email.\n\nThank you!`;
        sendEmail(user.email, subject, text);

        res.status(200).json({ message: 'Password reset link sent' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

//Logout user
exports.logout = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await
        User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User logged out successfully' });

    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}



// Middleware to authenticate user
exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    });
};
