const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to create a new order
router.post('/createOrder', orderController.createOrder);

// Route to get all orders for a customer
router.get('/customer/:customerId', orderController.getCustomerOrders);

// Route to get all orders (admin use)
router.get('/orders', orderController.getAllOrders);

// Route to get order details by ID
router.get('/:id', orderController.getOrderDetails);

// Route to update an existing order
router.put('/:id', orderController.updateOrderStatus);

// Route to delete an order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;