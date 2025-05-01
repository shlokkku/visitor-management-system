const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');

// Simple disk storage; in production, use S3 or GCP
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/documents/');
  },
  filename: function (req, file, cb) {
    // Add timestamp to filename for uniqueness
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage: storage });

// Admin: List all documents or by category
router.get('/', protect, authorize('Admin'), documentController.getAllDocuments);
// Admin: Download a document
router.get('/download/:id', protect, authorize('Admin'), documentController.downloadDocument);
// Admin: Delete a document
router.delete('/:id', protect, authorize('Admin'), documentController.deleteDocument);

// All: Upload document (tenant, resident, owner, admin)
router.post('/upload', protect, upload.single('file'), documentController.uploadDocument);

module.exports = router;