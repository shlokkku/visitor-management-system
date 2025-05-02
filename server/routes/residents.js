const express = require('express');
const router = express.Router();
const residentsController = require('../controllers/residentsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);


router.get('/', authorize('Admin'), residentsController.getAllResidents); 
router.post('/', authorize('Admin'), residentsController.addResident); 
router.put('/:id', authorize('Admin'), residentsController.updateResident);

module.exports = router;
