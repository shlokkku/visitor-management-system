const VisitorLog = require('../models/VisitorLog.mongo');
const { getResidentByFlatId } = require('../models/Resident.mysql');
const mongoose = require('mongoose');

// Get all visitor logs (Admin view)
exports.getVisitorLogs = async (req, res) => {
  try {
    const logs = await VisitorLog.find().sort({ entry_time: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching logs' });
  }
};

// Guard creates a visitor log
exports.createVisitorLog = async (req, res) => {
  try {
    const { visitor_id, name, contact_info, type, flat_id, purpose } = req.body;

    if (!visitor_id || !name || !contact_info || !type || !flat_id) {
      return res.status(400).json({ message: 'All fields are required, including flat ID.' });
    }

    const resident = await getResidentByFlatId(flat_id);
    if (!resident) {
      return res.status(404).json({ message: 'Flat not found.' });
    }

    const log = new VisitorLog({
      visitor_id,
      name,
      contact_info,
      type,
      flat_id,
      purpose,
      status: 'Pending',
    });

    await log.save();

    res.status(201).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating visitor log.', error: error.message });
  }
};

// Resident approves or denies a visitor
exports.updateVisitorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, updated_by } = req.body;

    const validStatuses = ['Approved', 'Denied', 'Pending', 'CheckedIn', 'CheckedOut'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values: ${validStatuses.join(', ')}` });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format. Must be a valid MongoDB ObjectId.' });
    }

    const log = await VisitorLog.findById(id);
    if (!log) {
      return res.status(404).json({ message: 'Visitor log not found.' });
    }

    // Update status
    log.status = status;

    // Update entry_time or exit_time based on the status
    if (status === 'CheckedIn') {
      log.entry_time = new Date();
    }
    if (status === 'CheckedOut') {
      log.exit_time = new Date();
    }

    // Add event to the events array
    log.events.push({
      action: status.toLowerCase(),
      timestamp: new Date(),
      by: updated_by,
    });

    await log.save();

    res.json({ message: 'Visitor status updated successfully.', log });
  } catch (error) {
    console.error('Error updating visitor status:', error);
    res.status(500).json({ message: 'Error updating visitor status.', error: error.message });
  }
};