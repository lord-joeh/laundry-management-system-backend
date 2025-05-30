const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
    },  
    address: {
        type: String,
        required: false,
        trim: true
    },
    loyaltyPoints: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);


module.exports = Customer;