const mongoose = require('mongoose');

const VisitorLogSchema = new mongoose.Schema(
  {
    visitorId: { type: Number, required: true }, // Links to Visitors table
    name: { type: String, required: true },
    contactInfo: { type: String, required: true },
    type: {
      type: String,
      enum: ['Guest', 'Delivery', 'Service', 'Other'],
      required: true,
    },
    flatId: { type: String, required: true }, // Flat ID as string
    purpose: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Denied', 'CheckedIn', 'CheckedOut'],
      default: 'Pending',
    },
    entryTime: { type: Date, default: null },
    exitTime: { type: Date, default: null },
    events: [
      {
        action: { type: String, enum: ['approved', 'denied'], required: true },
        timestamp: { type: Date, default: Date.now },
        by: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('VisitorLog', VisitorLogSchema);