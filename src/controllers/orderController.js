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
      const orderDetails = `
        <h2>Service:</h2>
        <ul>
          ${services
            .map(
              (s) =>
                `<li>Service ID: ${s.serviceType}, Quantity: ${s.quantity}, Price: GHS ${s.price}</li>`,
            )
            .join('')}
        </ul>
        <p>Total Amount: GHS ${order.totalAmount}</p>
        <p>Order ID: ${order._id}</p>
      `;
      sendOrderConfirmation(customer.email, orderDetails);
      sendSMS(
        customer.phoneNumber,
        `Your order with orderID: ${order._id} has been created successfully.
         Total amount: GHS ${order.totalAmount}
        `,
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
      sendNotification(
        customer.email,
        'Order Status Update',
        `<h2> Hello, ${customer.name} </h2> 
        <p>Your order with <em> orderID: ${id} </em> is <em>${order.status}</em> </p>
        `,
      );
      sendSMS(
        customer.phoneNumber,
        `Hello, ${customer.name}.
        Your order with orderID: ${id} is ${order.status}
        `,
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
