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

module.exports = router;