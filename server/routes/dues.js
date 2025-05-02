const express = require('express');
const router = express.Router();
const duesController = require('../controllers/duesController');
const { protect, authorize } = require('../middleware/auth');


router.use(protect);


router.get('/', authorize('Admin'), duesController.getAllDues); 
router.get('/:tenantId', authorize('Resident', 'Admin'), duesController.getResidentDues); 
router.post('/', authorize('Admin'), duesController.addDue); 


router.put('/clear/:id', authorize('Admin', 'Resident'), duesController.clearDuesByResidentId);


router.put('/:id', authorize('Admin'), duesController.updateDuesByResidentId);

module.exports = router;