const mongoose = require('mongoose');

const VisitorLogSchema = new mongoose.Schema(
  {
    visitor_id: { type: Number, required: true },
    name: { type: String, required: true },
    contact_info: { type: String, required: true },
    type: { type: String, enum: ['Guest', 'Delivery', 'Service', 'Other'], required: true },
    flat_id: { type: String, required: true },
    purpose: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Denied', 'CheckedIn', 'CheckedOut'], default: 'Pending' },
    entry_time: { type: Date, default: null },
    exit_time: { type: Date, default: null },
    events: [
      {
        action: { type: String, enum: ['approved', 'denied', 'checkedin', 'checkedout'], required: true },
        timestamp: { type: Date, default: Date.now },
        by: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('VisitorLog', VisitorLogSchema);