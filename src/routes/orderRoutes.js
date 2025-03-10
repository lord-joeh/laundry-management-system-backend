const express = require('express');
const router = express.Router();
const { createOrder, getCustomerOrders, getAllOrders, getOrderDetails, updateOrderStatus, deleteOrder } = require('../controllers/orderController');    
const { authenticate } = require('../middleware/auth');

// Route to create a new order
router.post('/createOrder', authenticate, createOrder);

// Route to get all orders for a customer
router.get('/customer/:customerId', authenticate, getCustomerOrders);

// Route to get all orders (admin use)
router.get('/orders', authenticate, getAllOrders);

// Route to get order details by ID
router.get('/:id', authenticate, getOrderDetails);

// Route to update an existing order
router.put('/:id', authenticate, updateOrderStatus);

// Route to delete an order
router.delete('/:id', authenticate, deleteOrder);

module.exports = router;