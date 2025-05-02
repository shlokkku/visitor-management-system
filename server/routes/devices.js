const express = require('express');
const router = express.Router();
const userDevicesController = require('../controllers/userDevicesController');
const { protect } = require('../middleware/auth');

// Register device token for push notifications
router.post('/register', protect, userDevicesController.registerDevice);

// Get all devices for user
router.get('/', protect, userDevicesController.getUserDevices);

module.exports = router;