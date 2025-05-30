const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

// Route to create a new customer
router.post('/', authenticate, createCustomer);

// Route to get all customers
router.get('/', authenticate, getAllCustomers);

// Route to get customer details by ID
router.get('/:id', authenticate, getCustomerById);

// Route to update customer information
router.put('/:id', authenticate, updateCustomer);

// Route to delete a customer
router.delete('/:id', authenticate, deleteCustomer);

module.exports = router;
