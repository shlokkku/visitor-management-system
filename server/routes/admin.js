const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const adminController = require('../controllers/adminController');


router.get('/profile', protect, adminOnly, adminController.getProfile);


router.put('/profile', protect, adminOnly, adminController.updateProfile);


router.get('/settings', protect, adminOnly, adminController.getSettings);


router.put('/settings', protect, adminOnly, adminController.updateSettings);

module.exports = router;