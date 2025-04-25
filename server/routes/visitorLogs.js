const express = require('express');
const router = express.Router();
const visitorLogController = require('../controllers/visitorLogController');
const { protect, authorize } = require('../middleware/auth');

// Protect all visitor log routes
router.use(protect);

// Routes for visitor logs
router.get('/', authorize('Admin'), visitorLogController.getVisitorLogs); // Get all visitor logs (Admin only)
router.post('/', authorize('Guard'), visitorLogController.createVisitorLog); // Create visitor log (Guard only)
router.put('/:id/status', authorize('Resident'), visitorLogController.updateVisitorStatus); // Update visitor status (Resident only)

module.exports = router;