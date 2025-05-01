const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const { protect, authorize } = require('../middleware/auth');

// Resident
router.get('/my', protect, authorize('Resident'), parkingController.getMyParking);
router.post('/vehicles', protect, authorize('Resident'), parkingController.addVehicle);
router.get('/vehicles', protect, authorize('Resident'), parkingController.getMyVehicles);
router.delete('/vehicles/:vehicle_id', protect, authorize('Resident'), parkingController.removeVehicle);

// Admin
router.get('/all', protect, authorize('Admin'), parkingController.getAllParking);
router.get('/spots', protect, authorize('Admin'), parkingController.getAllSpots);
router.post('/assign-spot', protect, authorize('Admin'), parkingController.assignSpot);
router.post('/unassign-spot', protect, authorize('Admin'), parkingController.unassignSpot);

module.exports = router;