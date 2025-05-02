const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const guardController = require('../controllers/guardsController');


router.use(protect);
router.use(authorize('Admin')); 


router.get('/', guardController.getAllGuards); 
router.post('/', guardController.addGuard); 
router.put('/:id', guardController.updateGuard); 
router.delete('/:id', guardController.deleteGuard); 

module.exports = router;