const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/test-token', protect, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});

module.exports = router;