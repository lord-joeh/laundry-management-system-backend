const Customer = require('../models/Customer');
const { sendNotification } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    const newCustomer = new Customer({ name, phoneNumber, email });
    await newCustomer.save();

    // Send email to customer
    sendNotification(
      email, 'Customer Registration',
      `<h3> Welcome to Styles Laundry Service.</h3>
             <p>Thank you for registering with our laundry service.</p>
            `,
    );

    // Send SMS to customer
    sendSMS(
      phoneNumber,
      `Welcome to Styles Laundry Service. 
             Thank you for registering with our laundry service.
            `,
    );
    res
      .status(201)
      .json({
        message: 'Customer created successfully',
        customer: newCustomer,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating customer', error: error.message });
  }
};

// Get customer information by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving customer', error: error.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting customer', error: error.message });
  }
};

// Update customer information
exports.updateCustomer = async (req, res) => {
  try {
    const { name, phoneNumber, email, loyaltyPoints } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phoneNumber, email, loyaltyPoints },
      { new: true },
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res
      .status(200)
      .json({
        message: 'Customer updated successfully',
        customer: updatedCustomer,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating customer', error: error.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving customers', error: error.message });
  }
};
