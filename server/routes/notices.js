const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { protect, adminOnly } = require('../middleware/auth');

// Admin routes
// Add a new notice
router.post('/', protect, adminOnly, noticeController.addNotice);

// Update an existing notice
router.put('/:id', protect, adminOnly, noticeController.updateNotice);

// Delete a notice
router.delete('/:id', protect, adminOnly, noticeController.deleteNotice);

// Fetch all notices
router.get('/', protect, adminOnly, noticeController.getAllNotices);

// Resident routes
// Fetch all active notices
router.get('/active', protect, noticeController.getActiveNotices);

module.exports = router;