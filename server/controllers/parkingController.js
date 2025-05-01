const Parking = require('../models/Parking');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all parking records for a society
// @route   GET /api/parking
// @access  Private
const getParkingRecords = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const parkingRecords = await Parking.find({ societyId: req.user.society_id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Parking.countDocuments({ societyId: req.user.society_id });

    res.status(200).json({
      success: true,
      count: parkingRecords.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: parkingRecords
    });
  } catch (err) {
    console.error('Error in getParkingRecords:', err);
    next(err);
  }
};

// @desc    Get single parking record
// @route   GET /api/parking/:id
// @access  Private
const getParkingRecord = async (req, res, next) => {
  try {
    const parking = await Parking.findOne({
      _id: req.params.id,
      societyId: req.user.society_id
    });

    if (!parking) {
      return next(new ErrorResponse('Parking record not found', 404));
    }

    res.status(200).json({
      success: true,
      data: parking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create parking record
// @route   POST /api/parking
// @access  Private (Admin only)
const createParkingRecord = async (req, res, next) => {
  try {
    const { flatInfo, vehicles, parkingNo, vehicleDetails, ownerName, contactNumber } = req.body;

    const parking = await Parking.create({
      flatInfo,
      vehicles,
      parkingNo,
      vehicleDetails,
      ownerName,
      contactNumber,
      societyId: req.user.society_id
    });

    res.status(201).json({
      success: true,
      data: parking
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getParkingRecords,
  getParkingRecord,
  createParkingRecord
};