const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Route to get all available laundry services
router.get('/allServices', serviceController.getAllServices);

// Route to get details of a specific service by ID
router.get('/:id', serviceController.getServiceById);

// Route to create a new laundry service (admin only)
router.post('/createService', serviceController.createService);

// Route to update an existing laundry service (admin only)
router.put('/:id', serviceController.updateService);

// Route to delete a laundry service (admin only)
router.delete('/:id', serviceController.deleteService);

module.exports = router;