const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
