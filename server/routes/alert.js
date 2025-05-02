const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');


router.post('/', protect, authorize('Resident'), alertController.createAlert);


router.get('/', protect, authorize('Admin', 'Guard'), alertController.getAlerts);


router.put('/:id/resolve', protect, authorize('Admin', 'Guard'), alertController.resolveAlert);

module.exports = router;