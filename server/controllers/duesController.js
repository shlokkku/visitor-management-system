const db = require('../config/db');

// Middleware to check if the user is an admin
const isAdmin = (req) => req.user && req.user.user_type === 'Admin';

// Middleware to check if the user is the same resident
const isResident = (req, residentId) => req.user && req.user.user_type === 'Resident' && req.user.linked_id === parseInt(residentId);

// Fetch all dues (Admin only)
exports.getAllDues = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const [dues] = await db.execute(`
      SELECT r.id, r.wing, r.flat_number, r.full_name, r.role, d.amount, d.status, d.due_date
      FROM Dues d
      INNER JOIN Residents r ON d.tenant_id = r.id
      WHERE d.status != 'Cleared'
      ORDER BY r.wing, r.flat_number ASC
    `);

    res.json(dues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dues', error: error.message });
  }
};

// Fetch dues for the authenticated resident
exports.getResidentDues = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!isResident(req, tenantId)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const [dues] = await db.execute(`
      SELECT d.id, d.amount, d.status, d.due_date, r.wing, r.flat_number, r.full_name
      FROM Dues d
      INNER JOIN Residents r ON d.tenant_id = r.id
      WHERE d.tenant_id = ?
    `, [tenantId]);

    if (dues.length === 0) {
      return res.status(404).json({ message: 'No dues found for this resident.' });
    }

    res.json(dues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resident dues', error: error.message });
  }
};

// Add a new due (Admin only)
exports.addDue = async (req, res) => {
  try {
    const { tenantId, amount, due_date } = req.body;

    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    if (!tenantId || !amount || amount <= 0 || !due_date) {
      return res.status(400).json({ message: 'Tenant ID, amount, and due date are required.' });
    }

    // Fetch the flat_id from the Residents table for the given tenantId
    const [residentData] = await db.execute(
      `SELECT id AS flat_id FROM Residents WHERE id = ?`,
      [tenantId]
    );

    if (residentData.length === 0) {
      return res.status(404).json({ message: 'Resident not found.' });
    }

    const flat_id = residentData[0].flat_id;

    // Add due to the Dues table
    const [result] = await db.execute(`
      INSERT INTO Dues (tenant_id, amount, due_date, status, flat_id)
      VALUES (?, ?, ?, 'Pending', ?)
    `, [tenantId, amount, due_date, flat_id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Due not created.' });
    }

    // Update dues_amount in the Residents table
    await db.execute(`
      UPDATE Residents
      SET dues_amount = COALESCE(dues_amount, 0) + ?
      WHERE id = ?
    `, [amount, tenantId]);

    res.json({ message: 'Due added successfully' });
  } catch (error) {
    console.error('Error adding due:', error.message);
    res.status(500).json({ message: 'Error adding due', error: error.message });
  }
};

// Update dues (Admin only)
exports.updateDuesByResidentId = async (req, res) => {
  try {
    const { id } = req.params; // ID of the due to update
    const { amount, status } = req.body; // Updated fields

    // Validate that at least one field is provided for update
    if (amount === undefined && status === undefined) {
      return res.status(400).json({ message: 'At least one field (amount or status) is required for update.' });
    }

    // Prepare the query dynamically
    const fields = [];
    const values = [];

    if (amount !== undefined) {
      fields.push('amount = ?');
      values.push(amount);
    }

    if (status !== undefined) {
      fields.push('status = ?');
      values.push(status);
    }

    // Add the ID as the last parameter for the WHERE clause
    values.push(id);

    // Execute the update query
    const [dueResult] = await db.execute(
      `UPDATE Dues SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if (dueResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Due not found or not updated.' });
    }

    // Update the Residents table
    const [due] = await db.execute(`SELECT tenant_id, amount, status FROM Dues WHERE id = ?`, [id]);

    if (due.length > 0 && due[0].status === 'Pending') {
      await db.execute(`
        UPDATE Residents
        SET dues_amount = ?
        WHERE id = ?
      `, [due[0].amount, due[0].tenant_id]);
    } else if (due.length > 0 && due[0].status === 'Cleared') {
      await db.execute(`
        UPDATE Residents
        SET dues_amount = 0
        WHERE id = ?
      `, [due[0].tenant_id]);
    }

    res.json({ message: 'Due updated successfully.' });
  } catch (error) {
    console.error('Error updating due:', error.message);
    res.status(500).json({ message: 'Error updating due', error: error.message });
  }
};

// Clear dues (Admin or the resident itself)
exports.clearDuesByResidentId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isAdmin(req) && !isResident(req, id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Clear dues in the Dues table
    const [result] = await db.execute(`
      UPDATE Dues
      SET status = 'Cleared'
      WHERE tenant_id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Resident not found or dues not cleared.' });
    }

    // Reset dues_amount in the Residents table
    await db.execute(`
      UPDATE Residents
      SET dues_amount = 0
      WHERE id = ?
    `, [id]);

    res.json({ message: 'Dues cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing dues', error: error.message });
  }
};