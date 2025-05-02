const express = require('express');
const router = express.Router();
const visitorLogController = require('../controllers/visitorLogController');
const { protect, authorize } = require('../middleware/auth');


router.use(protect);


router.get('/', authorize('Admin'), visitorLogController.getVisitorLogs); 
router.post('/', authorize('Guard'), visitorLogController.createVisitorLog); 
router.put('/:id/status', authorize('Resident'), visitorLogController.updateVisitorStatus); 

module.exports = router;