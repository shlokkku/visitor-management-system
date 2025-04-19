const express = require('express');
const router = express.Router();
const duesController = require('../controllers/duesController');

router.get('/', duesController.getPendingDues);
router.post('/', duesController.addDue);

module.exports = router;
