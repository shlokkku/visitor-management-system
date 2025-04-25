const db = require('../config/db');
const Guard = require('../models/Guard.mysql');

// Get all guards (Admin only)
exports.getAllGuards = async (req, res) => {
  try {
    const [guards] = await db.execute(`
      SELECT g.id, g.name, g.contact_info, g.shift_time, u.email
      FROM Guards g
      INNER JOIN Users u ON g.user_id = u.id
      ORDER BY g.name ASC
    `);

    res.json(guards);
  } catch (error) {
    console.error('Error fetching guards:', error.message);
    res.status(500).json({ message: 'Error fetching guards', error: error.message });
  }
};

// Add a new guard (Admin only)
exports.addGuard = async (req, res) => {
  try {
    const { email, password, name, contact_info, shift_time } = req.body;

    if (!email || !password || !name || !contact_info) {
      return res.status(400).json({ message: 'Email, password, name, and contact info are required.' });
    }

    // Check if email already exists
    const [existingUsers] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Guard with this email already exists.' });
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await db.execute(
      'INSERT INTO Users (email, password, user_type, linked_table) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, 'Guard', 'Guards']
    );

    const userId = userResult.insertId;

    // Create the guard
    const guardId = await Guard.create({ user_id: userId, name, contact_info, shift_time });

    res.status(201).json({
      message: 'Guard created successfully',
      guard: { id: guardId, email, name, contact_info, shift_time },
    });
  } catch (error) {
    console.error('Error adding guard:', error.message);
    res.status(500).json({ message: 'Error adding guard', error: error.message });
  }
};

// Update guard details (Admin only)
exports.updateGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_info, shift_time } = req.body;

    if (!name && !contact_info && !shift_time) {
      return res.status(400).json({ message: 'At least one field is required to update.' });
    }

    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (contact_info) {
      fields.push('contact_info = ?');
      values.push(contact_info);
    }
    if (shift_time) {
      fields.push('shift_time = ?');
      values.push(shift_time);
    }

    values.push(id);

    const [result] = await db.execute(
      `UPDATE Guards SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Guard not found or not updated.' });
    }

    res.json({ message: 'Guard updated successfully.' });
  } catch (error) {
    console.error('Error updating guard:', error.message);
    res.status(500).json({ message: 'Error updating guard', error: error.message });
  }
};

// Delete a guard (Admin only)
exports.deleteGuard = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the related user from the Users table
    const [result] = await db.execute('DELETE FROM Users WHERE id = (SELECT user_id FROM Guards WHERE id = ?)', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Guard not found or already deleted.' });
    }

    res.json({ message: 'Guard deleted successfully.' });
  } catch (error) {
    console.error('Error deleting guard:', error.message);
    res.status(500).json({ message: 'Error deleting guard', error: error.message });
  }
};