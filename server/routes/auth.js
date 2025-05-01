
const express = require('express');
// const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Google Auth route
router.post('/auth/google', authController.googleSignIn);


// Resident routes
router.post('/resident/signup', authController.residentSignup);
router.post('/resident/signin', authController.residentSignin);

// Admin routes
router.post('/admin/signup', authController.adminSignup);
router.post('/admin/signin', authController.adminSignin);

// Guard routes
router.post('/guard/signup', authController.guardSignup);
router.post('/guard/signin', authController.guardSignin);

// Google auth routes
router.post('/google', authController.googleSignIn);
router.post('/exchange-google-token', authController.exchangeGoogleToken);

module.exports = router;
