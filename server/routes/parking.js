// routes/parking.js
const express = require('express');
const router = express.Router();
const { 
  getParkingRecords,
  getParkingRecord,
  createParkingRecord
} = require('../controllers/parkingController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, (req, res, next) => {
    // Add debug logging
    console.log('Received request with query:', req.query);
    getParkingRecords(req, res, next);
  })
  .post(protect, authorize('admin'), createParkingRecord);

router.route('/:id')
  .get(protect, getParkingRecord);

module.exports = router;