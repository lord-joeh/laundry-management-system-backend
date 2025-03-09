const paystackConfig = require('../../config/paystack');
require('dotenv').config();
const Order = require('../models/Order');
const { sendNotification } = require('../utils/email');

exports.initializePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('customerId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.customerId) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const paymentData = await paystackConfig.initializePayment(order.totalAmount, order.customerId.email, order.customerId._id);

    // Save the payment reference in the order
    order.paymentReference = paymentData.data.reference;
    await order.save();

    // Send the authorization_url to the customer's email
    sendNotification(
      order.customerId.email, "Payment Authorization",
      `Please use the link below to complete your payment\n\n ${paymentData.data.authorization_url}`,
    );

    res.status(200).json({
      message: 'Payment initialized successfully and authorization link sent to email',
      paymentData: paymentData
    });
  } catch (error) {
    console.error('Error initializing payment:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const verificationData = await paystackConfig.verifyPayment(reference);

    if (verificationData.data.status === 'success') {
      // Find the order associated with the payment reference
      const order = await Order.findOne({ paymentReference: reference });
      if (order) {
        order.paymentStatus = 'paid';
        await order.save();
      }
    }

    res.status(200).json({
      message: 'Payment verified successfully',
      verificationData: verificationData
    });
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};