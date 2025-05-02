const db = require('../config/db');

// Create a new notification for all admins
exports.createNotificationForAdmin = async (req, res) => {
  const { type, title, message, data } = req.body;
  try {
    // Get all admins from Users table using user_type
    const [admins] = await db.execute('SELECT id FROM Users WHERE user_type = "Admin"');
    if (!admins.length) return res.status(404).json({ error: "No admin users found" });

    // Insert a notification for each admin
    for (const admin of admins) {
      await db.execute(
        `INSERT INTO Notifications (user_id, type, title, message, data)
         VALUES (?, ?, ?, ?, ?)`,
        [admin.id, type, title, message, JSON.stringify(data || {})]
      );

      // Optional: Emit Socket.IO notification for real-time update (if using socket.io)
      if (req.app && req.app.get("io")) {
        req.app.get("io").to(`user_${admin.id}`).emit("notification", {
          user_id: admin.id,
          type,
          title,
          message,
          data,
          is_read: false,
          created_at: new Date().toISOString()
        });
      }
    }
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute(
      `UPDATE Notifications SET is_read = TRUE WHERE id = ?`,
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark all notifications as read for the user
exports.markAllAsRead = async (req, res) => {
  const userId = req.user.id;
  try {
    await db.execute(
      `UPDATE Notifications SET is_read = TRUE WHERE user_id = ?`,
      [userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};