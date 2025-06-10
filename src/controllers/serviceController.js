const Service = require('../models/Service');
const crypto = require('crypto');

// Get all laundry services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({
      success: true,
      message: 'Services retrieved successfully',
      total: services.length,
      service: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving services',
      error: error.message,
    });
  }
};

// Get a specific laundry service by ID
exports.getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Service retrieved successfully',
      service: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving service',
      error: error.message,
    });
  }
};

// Create a new laundry service
exports.createService = async (req, res) => {
  const { serviceName, description, price } = req.body;
  if (!serviceName || !description || !price) {
    return res.status(403).json({
      success: false,
      message: 'All fields are required',
    });
  }
  const id = crypto.randomInt(10000000, 99999999).toString();

  const newService = new Service({ _id: id, serviceName, description, price });
  try {
    const savedService = await newService.save();
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service: savedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message,
    });
  }
};

// Update an existing laundry service
exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { serviceName, description, price } = req.body;
  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { serviceName, description, price },
      { new: true },
    );
    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message,
    });
  }
};

// Delete a laundry service
exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message,
    });
  }
};
