const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');


router.post('/resident/signup', authController.residentSignup);
router.post('/resident/signin', authController.residentSignin);


router.post('/admin/signup', authController.adminSignup);
router.post('/admin/signin', authController.adminSignin);

router.post('/guard/signup', authController.guardSignup);
router.post('/guard/signin', authController.guardSignin);

// MFA routes - setupMFA no longer needs protection since it's part of login flow
router.post('/mfa/setup', authController.setupMFA);
router.post('/mfa/verify', authController.verifyMFAToken);

module.exports = router;