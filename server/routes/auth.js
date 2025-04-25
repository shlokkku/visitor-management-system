const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Resident routes
router.post('/resident/signup', authController.residentSignup);
router.post('/resident/signin', authController.residentSignin);

// Admin routes
router.post('/admin/signup', authController.adminSignup);
router.post('/admin/signin', authController.adminSignin);

// Guard routes
router.post('/guard/signup', authController.guardSignup);
router.post('/guard/signin', authController.guardSignin);

module.exports = router;