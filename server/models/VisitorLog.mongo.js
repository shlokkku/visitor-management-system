const mongoose = require('mongoose');

const VisitorLogSchema = new mongoose.Schema({
  visitorId: Number, 
  name: String,
  contactInfo: String,
  type: String,
  entryTime: Date,
  exitTime: Date,
  status: { type: String, enum: ['Pending', 'Approved', 'Denied'], default: 'Pending' },
  approvedBy: Number, 
  events: [
    {
      action: String, 
      timestamp: Date,
      by: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('VisitorLog', VisitorLogSchema);