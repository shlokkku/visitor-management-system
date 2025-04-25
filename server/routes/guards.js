const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const guardController = require('../controllers/guardsController');

// Protect all guard routes
router.use(protect);
router.use(authorize('Admin')); // Only admins can access guard routes

// Routes for guards
router.get('/', guardController.getAllGuards); // Get all guards (Admin only)
router.post('/', guardController.addGuard); // Add a new guard (Admin only)
router.put('/:id', guardController.updateGuard); // Update guard details (Admin only)
router.delete('/:id', guardController.deleteGuard); // Delete guard (Admin only)

module.exports = router;