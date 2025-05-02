const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { protect, adminOnly } = require('../middleware/auth');


router.post('/', protect, adminOnly, noticeController.addNotice);

router.put('/:id', protect, adminOnly, noticeController.updateNotice);

router.delete('/:id', protect, adminOnly, noticeController.deleteNotice);


router.get('/', protect, adminOnly, noticeController.getAllNotices);

router.get('/active', protect, noticeController.getActiveNotices);

module.exports = router;