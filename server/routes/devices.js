const express = require('express');
const router = express.Router();
const userDevicesController = require('../controllers/userDevicesController');
const { protect } = require('../middleware/auth');


router.post('/register', protect, userDevicesController.registerDevice);


router.get('/', protect, userDevicesController.getUserDevices);

module.exports = router;