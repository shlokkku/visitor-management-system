const Alert = require('../models/Alert');
const db = require('../config/db');

// Resident creates alert
exports.createAlert = async (req, res) => {
  try {
    const { type, message, unit } = req.body;
    // Find resident id from MySQL
    const [residents] = await db.execute('SELECT id FROM Residents WHERE user_id = ?', [req.user.id]);
    const resident = residents[0];
    if (!resident) return res.status(400).json({ message: 'Resident profile not found' });

    const alert = await Alert.create({
      type,
      message,
      unit,
      resident_id: resident.id
    });

    // Real-time: Emit to admins and guards
    const io = req.app.get('io');
    if (io) {
      io.to('admins').emit('new-alert', alert);
      io.to('guards').emit('new-alert', alert);
    }

    res.status(201).json({ status: 'success', alert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create alert', error: error.message });
  }
};

// Admin/Guard fetch alerts
exports.getAlerts = async (req, res) => {
  try {
    const { status } = req.query;
    const alerts = await Alert.getAll(status);
    res.json({ status: 'success', data: alerts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
};

// Admin/Guard resolve alert
exports.resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Alert.resolve(id);
    if (!affectedRows) return res.status(404).json({ message: 'Alert not found' });

    const io = req.app.get('io');
    if (io) {
      io.to('admins').emit('alert-resolved', { id: Number(id) });
      io.to('guards').emit('alert-resolved', { id: Number(id) });
    }
    res.json({ status: 'success', id: Number(id) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to resolve alert', error: error.message });
  }
};