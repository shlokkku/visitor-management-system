const mongoose = require('mongoose');

const VisitorLogSchema = new mongoose.Schema(
  {
    visitor_id: { type: Number, required: true },
    name: { type: String, required: true },
    contact_info: { type: String, required: true },
    type: { type: String, enum: ['Guest', 'Delivery', 'Service', 'Other'], required: true },
    // flat_id REMOVED from schema fields
    resident_name: { type: String, required: true },
    wing: { type: String, required: true },
    flat_no: { type: String, required: true },
    purpose: { type: String },
    visit_date: { type: Date, required: true },
    visit_time: { type: Date, required: true, default: Date.now }, // auto-added
    expected_checkout_time: { type: Date, default: null },
    image_id: { type: String }, // MongoDB image ObjectId as string
    status: { type: String, enum: ['Pending', 'Approved', 'Denied', 'CheckedIn', 'CheckedOut'], default: 'Pending' },
    entry_time: { type: Date, default: null },
    exit_time: { type: Date, default: null },
    suspicious: { type: Boolean, default: false },
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

// Virtual for computed flat_id (not stored in DB)
VisitorLogSchema.virtual('flat_id').get(function () {
  return `${this.wing}-${this.flat_no}`;
});

VisitorLogSchema.set('toJSON', { virtuals: true });
VisitorLogSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('VisitorLog', VisitorLogSchema);