const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/documents/');
  },
  filename: function (req, file, cb) {
   
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage: storage });


router.get('/', protect, authorize('Admin'), documentController.getAllDocuments);

router.get('/download/:id', protect, authorize('Admin'), documentController.downloadDocument);

router.delete('/:id', protect, authorize('Admin'), documentController.deleteDocument);


router.post('/upload', protect, upload.single('file'), documentController.uploadDocument);

module.exports = router;