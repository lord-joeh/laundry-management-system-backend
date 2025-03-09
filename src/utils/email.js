const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // Use your email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
    },
});

const sendOrderConfirmation = (customerEmail, orderDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: 'Order Confirmation',
        text: `Thank you for your order! Here are your order details:\n\n${orderDetails}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email: ', error);
        }
        console.log('Email sent: ' + info.response);
    });
};

const sendNotification = (customerEmail, subject, message) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email: ', error);
        }
        console.log('Email sent: ' + info.response);
    });
};

module.exports = {
    sendOrderConfirmation,
    sendNotification,
};