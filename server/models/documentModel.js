const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String }, // Original file name from upload
  size: { type: Number, required: true }, // In bytes
  type: { type: String, required: true }, // pdf, doc, xls, img, etc.
  category: { type: String, required: true }, // rental, resident, society, etc.
  uploadedBy: { type: Number, required: true }, // <-- CHANGED TO Number
  uploadedByName: { type: String },
  unit: { type: String },
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
  dateUploaded: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  path: { type: String, required: true }
});

module.exports = mongoose.model('Document', documentSchema);