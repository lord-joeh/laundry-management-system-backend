const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      unique: true,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Customer',
    },
    services: [
      {
        serviceName: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'in progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'refunded', 'cancel'],
      default: 'unpaid',
    },
    paymentReference: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);
