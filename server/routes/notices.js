const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');

router.get('/', noticeController.getNotices);
router.post('/', noticeController.addNotice);

module.exports = router;
