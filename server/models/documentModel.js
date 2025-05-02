const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String }, 
  size: { type: Number, required: true }, 
  type: { type: String, required: true }, 
  category: { type: String, required: true }, 
  uploadedBy: { type: Number, required: true }, 
  uploadedByName: { type: String },
  unit: { type: String },
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
  dateUploaded: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  path: { type: String, required: true }
});

module.exports = mongoose.model('Document', documentSchema);