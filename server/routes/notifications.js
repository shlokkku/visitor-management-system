const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { protect } = require('../middleware/auth');

// Send notification to all admins (no user_id needed in body)
router.post('/admin', protect, notificationsController.createNotificationForAdmin);

// Get notifications for logged-in user
router.get('/', protect, notificationsController.getNotifications);

// Mark as read
router.put('/:id/read', protect, notificationsController.markAsRead);

// Mark all as read
router.put('/read/all', protect, notificationsController.markAllAsRead);

module.exports = router;