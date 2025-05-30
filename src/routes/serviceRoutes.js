const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { authenticate } = require('../middleware/auth');

// Route to get all available laundry services
router.get('/', getAllServices);

// Route to get details of a specific service by ID
router.get('/:id', getServiceById);

// Route to create a new laundry service (admin only)
router.post('/', authenticate, createService);

// Route to update an existing laundry service (admin only)
router.put('/:id', authenticate, updateService);

// Route to delete a laundry service (admin only)
router.delete('/:id', authenticate, deleteService);

module.exports = router;
