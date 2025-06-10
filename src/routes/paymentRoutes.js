const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route for payment initialization
router.post('/:id', paymentController.initializePayment);

// Route for payment verification
router.get('/:reference', paymentController.verifyPayment);

module.exports = router;
