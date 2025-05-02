const VisitorLog = require('../models/VisitorLog.mongo');
const mongoose = require('mongoose');

// MongoDB native driver for image storing
const { MongoClient, ObjectId } = require('mongodb');
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'yourMongoDb'; // change to your MongoDB database name
const imageCollection = 'visitorImages';

exports.getVisitorLogs = async (req, res) => {
  try {
    const logs = await VisitorLog.find().sort({ entry_time: -1 }).limit(100);
    res.json(logs); // flat_id will be included as a virtual field
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching logs' });
  }
};

// expects req.file (image upload, see routes)
exports.createVisitorLog = async (req, res) => {
  try {
    // If an image is uploaded, save to MongoDB via native driver, store image_id
    let image_id = null;
    if (req.file && req.file.buffer && req.file.mimetype.startsWith('image/')) {
      const base64Image = req.file.buffer.toString('base64');
      let client;
      try {
        client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        const result = await db.collection(imageCollection).insertOne({
          image: base64Image,
          fileType: req.file.mimetype,
          uploadedAt: new Date(),
        });
        image_id = result.insertedId.toString();
      } finally {
        if (client) client.close();
      }
    }

    // Extract the rest of the fields from req.body
    const {
      visitor_id,
      name,
      contact_info,
      type,
      resident_name,
      wing,
      flat_no,
      purpose,
      visit_date,
      expected_checkout_time,
    } = req.body;

    // Remove flat_id from validation and object creation
    if (
      !visitor_id ||
      !name ||
      !contact_info ||
      !type ||
      !resident_name ||
      !wing ||
      !flat_no ||
      !visit_date
    ) {
      return res.status(400).json({ message: 'All fields are required except expected_checkout_time and image.' });
    }

    const log = new VisitorLog({
      visitor_id,
      name,
      contact_info,
      type,
      resident_name,
      wing,
      flat_no,
      purpose,
      visit_date,
      visit_time: new Date(), // auto-added
      expected_checkout_time: expected_checkout_time || null,
      image_id: image_id, // store MongoDB image ID or null
      status: 'Pending',
    });

    await log.save();

    res.status(201).json(log); // flat_id will be included as a virtual field
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating visitor log.', error: error.message });
  }
};

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

    log.status = status;
    if (status === 'CheckedIn') log.entry_time = new Date();
    if (status === 'CheckedOut') log.exit_time = new Date();

    log.events.push({
      action: status.toLowerCase(),
      timestamp: new Date(),
      by: updated_by,
    });

    // If Denied, check denial count and set suspicious if ≥ 3
    if (status === 'Denied') {
      const deniedCount = await VisitorLog.countDocuments({
        visitor_id: log.visitor_id,
        status: 'Denied',
      });

      if (deniedCount + 1 >= 3) { // +1 for current denial
        await VisitorLog.updateMany(
          { visitor_id: log.visitor_id },
          { $set: { suspicious: true } }
        );
        log.suspicious = true;
      }
    }

    await log.save();

    res.json({ message: 'Visitor status updated successfully.', log });
  } catch (error) {
    console.error('Error updating visitor status:', error);
    res.status(500).json({ message: 'Error updating visitor status.', error: error.message });
  }
};