const paystackConfig = require('../../config/paystack');
require('dotenv').config();
const Order = require('../models/Order');
const { sendNotification } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

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

    const paymentData = await paystackConfig.initializePayment(
      order.totalAmount,
      order.customerId.email,
      order.customerId._id,
    );

    // Save the payment reference in the order
    order.paymentReference = paymentData.data.reference;
    await order.save();

    // Send the authorization_url to the customer's email
    const authorizationEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #007bff;">Payment Authorization</h2>
        <p>Dear ${order.customerId.name},</p>
        <p>Please click on the button below to complete your payment:</p>
        <a href="${paymentData.data.authorization_url}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Complete Payment</a>
        <p>If you have any questions, feel free to contact us at any time.</p>
        <p>Best regards,</p>
        <p><strong>Styles Laundry Service Team</strong></p>
    </div>
`;
    sendNotification(
      order.customerId.email,
      'Payment Completion',
      authorizationEmail,
    );
    sendSMS(
      order.customerId.phoneNumber,
      `Please use this link to complete your payment. ${paymentData.data.authorization_url}`,
    );

    res.status(200).json({
      message:
        'Payment initialized successfully and authorization link sent to successfully',
      paymentData: paymentData,
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
      verificationData: verificationData,
    });
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
