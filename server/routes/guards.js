const express = require('express');
const { guardSignup, guardSignin } = require('../controllers/authController'); // Import the Guard controller functions

const router = express.Router();

// Route for Guard Sign-up
// Endpoint: POST /api/guards/signup
// Description: This route allows a new guard to register.
router.post('/signup', guardSignup);

// Route for Guard Sign-in
// Endpoint: POST /api/guards/signin
// Description: This route allows a guard to log in.
router.post('/signin', guardSignin);

module.exports = router;