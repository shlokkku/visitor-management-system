const express = require('express');
const router = express.Router();
const residentsController = require('../controllers/residentsController');
const { protect, authorize } = require('../middleware/auth');

// Protect all residents routes
router.use(protect);

// Routes for residents
// Updated to support search query
router.get('/', authorize('Admin'), residentsController.getAllResidents); // Get all residents (Admin only)
router.post('/', authorize('Admin'), residentsController.addResident); // Add a new resident (Admin only)
router.put('/:id', authorize('Admin'), residentsController.updateResident); // Update resident details (Admin only)

module.exports = router;
