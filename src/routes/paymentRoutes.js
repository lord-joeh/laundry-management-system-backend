const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route for payment initialization
router.post('/initialize-payment/:id', paymentController.initializePayment);

// Route for payment verification
router.get('/verify-payment/:reference', paymentController.verifyPayment);

module.exports = router;
