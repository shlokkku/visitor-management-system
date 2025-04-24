const VisitorLog = require('../models/VisitorLog.mongo');
const { getResidentByFlatId } = require('../models/Resident.mysql');

// Get all visitor logs (Admin view)
exports.getVisitorLogs = async (req, res) => {
  try {
    const logs = await VisitorLog.find().sort({ entryTime: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching logs' });
  }
};

// Guard creates a visitor log
exports.createVisitorLog = async (req, res) => {
  try {
    const { visitorId, name, contactInfo, type, flatId, purpose } = req.body;

    // Validate input
    if (!visitorId || !name || !contactInfo || !type || !flatId) {
      return res.status(400).json({ message: 'All fields are required, including flatId' });
    }

    // Ensure the flat exists (MySQL query)
    const resident = await getResidentByFlatId(flatId);
    if (!resident) {
      return res.status(404).json({ message: 'Flat not found' });
    }

    // Create new visitor log
    const log = new VisitorLog({
      visitorId,
      name,
      contactInfo,
      type,
      flatId, // Flat ID as string
      purpose,
      status: 'Pending',
    });

    await log.save();

    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating visitor log', error: err.message });
  }
};

// Resident approves or denies a visitor
exports.updateVisitorStatus = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB ID of the VisitorLog
    const { status, by } = req.body; // Status: 'Approved' or 'Denied'

    // Validate `status`
    const validStatuses = ['Pending', 'Approved', 'Denied', 'CheckedIn', 'CheckedOut'];
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(); // Normalize the status

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ message: `Invalid status. Allowed values are: ${validStatuses.join(', ')}` });
    }

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find the visitor log by ID
    const log = await VisitorLog.findById(id);
    if (!log) {
      return res.status(404).json({ message: 'Visitor log not found' });
    }

    // Update the status and add an event
    log.status = normalizedStatus; // Use normalized status
    log.events.push({
      action: normalizedStatus.toLowerCase(),
      timestamp: new Date(),
      by,
    });

    await log.save();

    // Emit real-time event for admin (if applicable)
    req.io?.emit('visitorLogUpdated', log);

    res.json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating visitor status', error: err.message });
  }
};