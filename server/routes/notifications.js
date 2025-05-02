const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { protect } = require('../middleware/auth');


router.post('/admin', protect, notificationsController.createNotificationForAdmin);


router.get('/', protect, notificationsController.getNotifications);

router.put('/:id/read', protect, notificationsController.markAsRead);


router.put('/read/all', protect, notificationsController.markAllAsRead);

module.exports = router;