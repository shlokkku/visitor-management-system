const express = require('express');
const router = express.Router();
const visitorLogController = require('../controllers/visitorLogController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

router.get('/', authorize('Admin'), visitorLogController.getVisitorLogs); 
// CHANGED: add 'upload.single("image")' for image form field
router.post('/', authorize('Guard'), upload.single('image'), visitorLogController.createVisitorLog); 
router.put('/:id/status', authorize('Resident'), visitorLogController.updateVisitorStatus); 

module.exports = router;