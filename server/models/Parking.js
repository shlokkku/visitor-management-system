const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  flatInfo: {
    type: String,
    required: [true, 'Flat information is required'],
    trim: true
  },
  vehicles: {
    type: Number,
    required: [true, 'Number of vehicles is required'],
    min: [0, 'Vehicles count cannot be negative']
  },
  parkingNo: {
    type: String,
    required: [true, 'Parking number is required'],
    unique: true,
    trim: true
  },
  vehicleDetails: {
    type: String,
    required: [true, 'Vehicle details are required']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
parkingSchema.index({ societyId: 1, parkingNo: 1 }, { unique: true });
parkingSchema.index({ societyId: 1, flatInfo: 1 });

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;