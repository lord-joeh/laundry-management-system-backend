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
      sendOrderConfirmation(
        customer.email,
        `Service:\n ${services
          .map(
            (s) =>
              `Service ID: ${s.serviceType} , Quantity: ${s.quantity} , Price: GHS ${s.price}`,
          )
          .join('\n')}\nTotal Amount: GHS ${order.totalAmount}\nOrder ID: ${
          order._id
        }`,
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

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);

    const customer = await Customer.findById(order.customerId);
    if (customer) {
      sendNotification(
        customer.email,
        'Order Status Update',
        `Hello ${customer.name}\n\nYour order with orderID: ${id} is ${order.status}`,
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
