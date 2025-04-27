const express = require('express');
const router = express.Router();
const duesController = require('../controllers/duesController');
const { protect, authorize } = require('../middleware/auth');

// Protect all dues routes
router.use(protect);

// Routes for dues
router.get('/', authorize('Admin'), duesController.getAllDues); // Get all dues (Admin only)
router.get('/:tenantId', authorize('Resident', 'Admin'), duesController.getResidentDues); // Get dues for a resident
router.post('/', authorize('Admin'), duesController.addDue); // Add a new due (Admin only)

// Clear dues (Admin or Resident)
router.put('/clear/:id', authorize('Admin', 'Resident'), duesController.clearDuesByResidentId);

// Update dues (Admin only)
router.put('/:id', authorize('Admin'), duesController.updateDuesByResidentId);

module.exports = router;