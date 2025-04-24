const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Resident Routes
router.post('/resident/signup', authController.residentSignup);
router.post('/resident/signin', authController.residentSignin);

// Admin Routes
router.post('/admin/signup', authController.adminSignup);
router.post('/admin/signin', authController.adminSignin);

// Guard Routes (if needed)
router.post('/guard/signup', authController.guardSignup);
router.post('/guard/signin', authController.guardSignin);

module.exports = router;