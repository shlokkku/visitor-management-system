// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout);

// Protected route example
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;