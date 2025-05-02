const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Get admin profile (merged from Users and Admin table)
router.get('/profile', protect, adminOnly, adminController.getProfile);

// Update admin profile (name, contact_info)
router.put('/profile', protect, adminOnly, adminController.updateProfile);

// Get admin settings
router.get('/settings', protect, adminOnly, adminController.getSettings);

// Update admin settings
router.put('/settings', protect, adminOnly, adminController.updateSettings);

module.exports = router;