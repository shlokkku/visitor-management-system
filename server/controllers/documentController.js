const Document = require('../models/documentModel');
const fs = require('fs');
const path = require('path');

// Helper: get file extension/type
function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  if (['xls', 'xlsx'].includes(ext)) return 'xls';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'img';
  return 'file';
}

// GET /api/documents?category=resident
exports.getAllDocuments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.unit) filter.unit = req.query.unit;
    const docs = await Document.find(filter).sort({ dateUploaded: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching documents', error: err.message });
  }
};

// POST /api/documents/upload
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const {
      category,
      unit,
      residentId,
      ownerId
    } = req.body;

    if (!category) return res.status(400).json({ message: 'Document category is required' });

    const doc = await Document.create({
      name: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: getFileType(req.file.originalname),
      category,
      uploadedBy: req.user.id,
      uploadedByName: req.user.full_name || req.user.name || req.user.email,
      unit,
      residentId,
      ownerId,
      path: req.file.path,
      dateUploaded: new Date(),
      lastUpdated: new Date()
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Error uploading document', error: err.message });
  }
};

// GET /api/documents/download/:id
exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.resolve(doc.path);

    // Check if the file exists before trying to download
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, doc.originalName || doc.name);
  } catch (err) {
    res.status(500).json({ message: 'Error downloading document', error: err.message });
  }
};

// DELETE /api/documents/:id
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Remove from filesystem if exists
    try {
      if (fs.existsSync(doc.path)) {
        fs.unlinkSync(doc.path);
      }
    } catch (err) {
      // Log error but continue to remove DB record
      console.warn('File delete error:', err.message);
    }
    await doc.remove();
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting document', error: err.message });
  }
};