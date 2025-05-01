const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintsController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Resident actions
router.post('/', protect, complaintController.createComplaint);
router.get('/my', protect, complaintController.getMyComplaints);

// Admin & resident (owner): complaint details, comment, attach
router.get('/:id', protect, complaintController.getComplaintDetail);
router.post('/:id/comment', protect, complaintController.addComment);
router.post('/:id/attachment', protect, upload.single('file'), complaintController.addAttachment);

// Admin actions
router.get('/', protect, complaintController.getAllComplaints);
router.put('/:id/status', protect, complaintController.updateStatus);
router.put('/:id/assign', protect, complaintController.assignTo);

module.exports = router;