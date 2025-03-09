const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Route to create a new customer
router.post('/createCustomer', customerController.createCustomer);

// Route to get all customers
router.get('/allCustomers', customerController.getAllCustomers);

// Route to get customer details by ID
router.get('/:id', customerController.getCustomerById);

// Route to update customer information
router.put('/:id', customerController.updateCustomer);

// Route to delete a customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;