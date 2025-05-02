const db = require('../config/db');

// Register a device (save or update device token for user)
exports.registerDevice = async (req, res) => {
  const userId = req.user.id;
  const { device_token, device_type } = req.body;
  try {
    // Upsert (update if exists, else insert)
    await db.execute(
      `INSERT INTO UserDevices (user_id, device_token, device_type)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE device_type = VALUES(device_type), created_at = CURRENT_TIMESTAMP`,
      [userId, device_token, device_type]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all device tokens for a user (for push delivery)
exports.getUserDevices = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM UserDevices WHERE user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};