const db = require('../config/db');

// Fetch all residents
exports.getAllResidents = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      // Ensure page and limit are positive integers
      const parsedPage = Math.max(1, parseInt(page, 10));
      const parsedLimit = Math.max(1, parseInt(limit, 10));
      const offset = (parsedPage - 1) * parsedLimit;
  
      // Validate parsed values
      if (isNaN(parsedPage) || isNaN(parsedLimit)) {
        return res.status(400).json({ status: 'error', message: 'Invalid pagination parameters. Ensure page and limit are numbers.' });
      }
  
      console.log('Pagination Parameters:', { page: parsedPage, limit: parsedLimit, offset });
  
      // Execute the query
      const [residents] = await db.execute(`
        SELECT r.id, r.wing, r.flat_number, r.full_name, r.role, r.dues_amount
        FROM Residents r
        ORDER BY r.wing, r.flat_number ASC
        LIMIT ? OFFSET ?
      `, [parsedLimit, offset]);
  
      console.log('Query Results:', residents);
  
      res.json({
        status: 'success',
        data: residents,
        pagination: { page: parsedPage, limit: parsedLimit },
      });
    } catch (error) {
      console.error('Error fetching residents:', error);
      res.status(500).json({ status: 'error', message: 'Error fetching residents', error: error.message });
    }
  };

// Add a new resident
exports.addResident = async (req, res) => {
  try {
    const { full_name, wing, flat_number, role } = req.body;

    // Validate input
    if (!full_name || typeof full_name !== 'string' || full_name.trim() === '') {
      return res.status(400).json({ message: 'Full name is required and must be a valid string.' });
    }
    if (!wing || typeof wing !== 'string' || wing.trim() === '') {
      return res.status(400).json({ message: 'Wing is required and must be a valid string.' });
    }
    if (!flat_number || typeof flat_number !== 'string' || flat_number.trim() === '') {
      return res.status(400).json({ message: 'Flat number is required and must be a valid string.' });
    }
    if (!role || !['Owner', 'Tenant', 'Family Member'].includes(role)) {
      return res.status(400).json({ message: 'Role is required and must be one of "Owner", "Tenant", or "Family Member".' });
    }

    const flatId = `${wing}-${flat_number}`;
    const [residentResult] = await db.execute(`
      INSERT INTO Residents (flatId, full_name, wing, flat_number, role)
      VALUES (?, ?, ?, ?, ?)
    `, [flatId, full_name, wing, flat_number, role]);

    res.status(201).json({
      status: 'success',
      message: 'Resident added successfully',
      residentId: residentResult.insertId,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ status: 'error', message: 'Flat ID already exists. Please use a different wing and flat number.' });
    }
    console.error('Error adding resident:', error);
    res.status(500).json({ status: 'error', message: 'Error adding resident', error: error.message });
  }
};

// Update a resident
exports.updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, wing, flat_number, role, dues_amount } = req.body;

    const fields = [];
    const values = [];

    if (full_name) fields.push('full_name = ?'), values.push(full_name);
    if (wing) fields.push('wing = ?'), values.push(wing);
    if (flat_number) fields.push('flat_number = ?'), values.push(flat_number);
    if (role) fields.push('role = ?'), values.push(role);
    if (dues_amount !== undefined) fields.push('dues_amount = ?'), values.push(dues_amount);

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields provided to update.' });
    }

    values.push(id);

    const [result] = await db.execute(`
      UPDATE Residents
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Resident not found.' });
    }

    res.json({ status: 'success', message: 'Resident updated successfully.' });
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({ status: 'error', message: 'Error updating resident', error: error.message });
  }
};