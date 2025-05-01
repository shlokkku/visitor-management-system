const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  authorUserId: { type: Number, required: true },      // SQL users.id
  authorUserType: { type: String, enum: ['Admin', 'Resident'], required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String }, // Owner/Tenant/Family Member for residents, null for Admin
  createdAt: { type: Date, default: Date.now }
});

const AttachmentSchema = new mongoose.Schema({
  url: String,
  name: String,
  type: String
});

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  status: { type: String, enum: ['open', 'inProgress', 'resolved'], default: 'open' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  residentUserId: { type: Number, required: true },          // SQL users.id
  residentName: { type: String, required: true },
  residentRole: { type: String, required: true },            // Owner/Tenant/Family Member
  flatId: { type: String, required: true },
  wing: { type: String, required: true },
  flat_number: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  assignedToUserId: { type: Number },                        // SQL users.id for Admin
  assignedToName: { type: String },
  comments: [CommentSchema],
  attachments: [AttachmentSchema]
});

module.exports = mongoose.model('Complaint', ComplaintSchema);