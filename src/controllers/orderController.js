const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Service = require('../models/Service');
const { sendOrderConfirmation, sendNotification } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

// Helper function to calculate total amount
const calculateTotalAmount = async (services) => {
  let totalAmount = 0;
  for (const service of services) {
    const serviceDetails = await Service.findById(service.serviceType);
    if (!serviceDetails) {
      throw new Error(`Service not found for ID: ${service.serviceType}`);
    }
    service.price = serviceDetails.price; // Ensure price is set
    service.name = serviceDetails.serviceType; // Add service name
    totalAmount += serviceDetails.price * service.quantity;
  }
  return totalAmount;
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customerId, services } = req.body;

    // Validate input
    if (!customerId || !services || !Array.isArray(services)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Calculate the total amount
    const totalAmount = await calculateTotalAmount(services);

    const order = new Order({
      customerId,
      services,
      totalAmount,
    });

    await order.save();
    const customer = await Customer.findById(customerId);
    if (customer) {
      const orderDetails = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #007bff;">Order Confirmation</h2>
          <p>Dear ${customer.name},</p>
          <p>Thank you for your order! Here are the details of your order:</p>
          <h3>Service Details</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${services
              .map(
                (s) =>
                  `<li style="margin-bottom: 10px;"><strong>Service:</strong> ${s.name}, <strong>Quantity:</strong> ${s.quantity}, <strong>Price:</strong> GHS ${s.price}</li>`,
              )
              .join('')}
          </ul>
          <p><strong>Total Amount:</strong> GHS ${order.totalAmount}</p>
          <p><strong>Order ID:</strong> ${order._id.toString()}</p>
          <p>If you have any questions, feel free to contact us at any time.</p>
          <p>Best regards,</p>
          <p><strong>Styles Laundry Service Team</strong></p>
        </div>
      `;
      sendOrderConfirmation(customer.email, orderDetails);
      sendSMS(
        customer.phoneNumber,
        `Your order with orderID: ${order._id.toString()} has been created successfully. Total amount: GHS ${order.totalAmount}`,
      );
    }

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate input
    if (!status) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);

    const customer = await Customer.findById(order.customerId);
    if (customer) {
      const statusUpdateEmail = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #007bff;">Order Status Update</h2>
            <p>Dear ${customer.name},</p>
            <p>Your order with <strong>Order ID: ${id.toString()}</strong> is now <strong>${order.status}</strong>.</p>
            <p>If you have any questions, feel free to contact us at any time.</p>
            <p>Best regards,</p>
            <p><strong>Styles Laundry Service Team</strong></p>
        </div>
      `;
      sendNotification(
        customer.email,
        'Order Status Update',
        statusUpdateEmail,
      );
      sendSMS(
        customer.phoneNumber,
        `Your order with orderID: ${id.toString()} is ${order.status}`,
      );
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating order status', error: error.message });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('customerId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order details', error });
  }
};

// Get all orders for a customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customerId });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving customer orders', error });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting order', error: error.message });
  }
};
