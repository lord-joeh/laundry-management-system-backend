const Service = require('../models/Service');

// Get all laundry services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving services', error });
    }
};

// Get a specific laundry service by ID
exports.getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving service', error });
    }
};

// Create a new laundry service
exports.createService = async (req, res) => {
    const { serviceType, description, price } = req.body;
    const newService = new Service({ serviceType, description, price });
    try {
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(500).json({ message: 'Error creating service', error });
    }
};

// Update an existing laundry service
exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { serviceType, description, price } = req.body;
    try {
        const updatedService = await Service.findByIdAndUpdate(id, { serviceType, description, price }, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: 'Error updating service', error });
    }
};

// Delete a laundry service
exports.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service', error });
    }
};