const Customer = require('../models/Customer');
const { sendNotification } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    if (!name || !phoneNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    const newCustomer = new Customer({ name, phoneNumber, email });
    await newCustomer.save(); 

    // Send email to customer
    sendNotification(
      email,
      'Customer Registration',
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #007bff;">Welcome to Styles Laundry Service!</h2>
                <p>Dear ${name},</p>
                <p>Thank you for registering with us. We are excited to have you on board.</p>
                <p>If you have any questions, feel free to contact us at any time.</p>
                <p>Best regards,</p>
                <p><strong>Styles Laundry Service Team</strong></p>
            </div>
          `,
    );

    // Send SMS to customer
    sendSMS(
      phoneNumber,
      `Welcome to Styles Laundry Service. Thank you for registering with our laundry service.`,
    );
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      customer: newCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: error.message,
    });
  }
};

// Get customer information by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Customer order retrieved successfully',
      customer: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving customer',
      error: error.message,
    });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting customer',
      error: error.message,
    });
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
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating customer',
      error: error.message,
    });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    if (!customers) {
      return res.status(404).json({
        success: false,
        message: 'No Customers was found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      total: customers.length,
      customer: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving customers',
      error: error.message,
    });
  }
};
