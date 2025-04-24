const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getVisitorLogs,
  createVisitorLog,
  updateVisitorStatus,
} = require('../controllers/VisitorLogController.js');

const router = express.Router();

// Route to get all visitor logs (Admin view)
router.get('/', protect, authorize('Admin'), getVisitorLogs);

// Route to create a visitor log (Guard creates)
router.post('/', protect, authorize('Guard'), createVisitorLog);

// Route to approve/deny a visitor log (Owner, Tenant, Family Member, or Admin)
router.post('/:id/approve', protect, authorize('Owner', 'Tenant', 'Family Member', 'Admin'), updateVisitorStatus);

module.exports = router;