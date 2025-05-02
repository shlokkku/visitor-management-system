const db = require('../config/db');

// Get admin profile (combine Users and Admin)
exports.getProfile = async (req, res) => {
  try {
    // join Users and Admin for full profile
    const [rows] = await db.execute(
      `SELECT 
         u.id AS user_id, u.email, u.user_type, u.contact_info AS user_contact, 
         a.id AS admin_id, a.name, a.contact_info AS admin_contact, a.created_at, a.updated_at
       FROM Users u
       JOIN Admin a ON u.id = a.user_id
       WHERE u.id = ? AND u.user_type = 'Admin'`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Admin not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update admin profile (name, contact_info)
exports.updateProfile = async (req, res) => {
  try {
    const { name, contact_info } = req.body;

    // Validate name (required, not empty)
    if (typeof name === "undefined" || name.trim() === "") {
      return res.status(400).json({ message: "Name is required and cannot be empty." });
    }

    const updates = [];
    const params = [];

    // Always update name (required)
    updates.push("name = ?");
    params.push(name);

    // Optionally update contact_info
    if (typeof contact_info !== "undefined") {
      updates.push("contact_info = ?");
      params.push(contact_info);
    }

    params.push(req.user.id);

    await db.execute(
      `UPDATE Admin SET ${updates.join(", ")} WHERE user_id = ?`,
      params
    );

    // Optionally update Users.contact_info if contact_info is sent
    if (typeof contact_info !== "undefined") {
      await db.execute(
        `UPDATE Users SET contact_info = ? WHERE id = ?`,
        [contact_info, req.user.id]
      );
    }

    // Return updated profile
    const [rows] = await db.execute(
      `SELECT 
         u.id AS user_id, u.email, u.user_type, u.contact_info AS user_contact, 
         a.id AS admin_id, a.name, a.contact_info AS admin_contact, a.created_at, a.updated_at
       FROM Users u
       JOIN Admin a ON u.id = a.user_id
       WHERE u.id = ? AND u.user_type = 'Admin'`,
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get admin settings (from Users table)
exports.getSettings = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT notifications, dark_mode AS darkMode, two_factor AS twoFactor FROM Users WHERE id = ? AND user_type = 'Admin'`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Admin not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update admin settings (in Users table)
exports.updateSettings = async (req, res) => {
  try {
    const { notifications, darkMode, twoFactor } = req.body;
    // Only update fields that are present in body
    const updates = [];
    const params = [];
    if (typeof notifications === 'boolean') {
      updates.push('notifications = ?');
      params.push(notifications);
    }
    if (typeof darkMode === 'boolean') {
      updates.push('dark_mode = ?');
      params.push(darkMode);
    }
    if (typeof twoFactor === 'boolean') {
      updates.push('two_factor = ?');
      params.push(twoFactor);
    }
    if (!updates.length) {
      return res.status(400).json({ message: 'No settings to update' });
    }
    params.push(req.user.id);
    await db.execute(
      `UPDATE Users SET ${updates.join(', ')} WHERE id = ? AND user_type = 'Admin'`,
      params
    );
    // Return updated settings
    const [rows] = await db.execute(
      `SELECT notifications, dark_mode AS darkMode, two_factor AS twoFactor FROM Users WHERE id = ?`,
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};