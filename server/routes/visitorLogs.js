const express = require('express');
const VisitorLog = require('../models/VisitorLog.mongo');
const router = express.Router();

// Get all visitor logs (real-time feed)
router.get('/', async (req, res) => {
  const logs = await VisitorLog.find().sort({ entryTime: -1 }).limit(100);
  res.json(logs);
});
// Add this route to allow adding new activity logs
router.post('/', async (req, res) => {
    try {
      const log = new VisitorLog(req.body);
      await log.save();
      res.status(201).json(log);
    } catch (err) {
      res.status(400).json({ message: 'Error creating log', error: err.message });
    }
  });
  
// Approve/deny visitor
router.post('/:id/approve', async (req, res) => {
  const { status, by } = req.body; // status: 'Approved' or 'Denied'
  const log = await VisitorLog.findByIdAndUpdate(
    req.params.id,
    {
      status,
      $push: { events: { action: status.toLowerCase(), timestamp: new Date(), by } }
    },
    { new: true }
  );
  // Optionally emit real-time event via Socket.IO here
  res.json(log);
});

module.exports = router;