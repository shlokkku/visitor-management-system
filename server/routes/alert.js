const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');

// Resident sends alert
router.post('/', protect, authorize('Resident'), alertController.createAlert);

// Admin/Guard views alerts
router.get('/', protect, authorize('Admin', 'Guard'), alertController.getAlerts);

// Admin/Guard resolves alert
router.put('/:id/resolve', protect, authorize('Admin', 'Guard'), alertController.resolveAlert);

module.exports = router;