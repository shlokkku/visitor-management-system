const db = require('../config/db');


exports.getAllResidents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', wing, flat_number, sortBy = 'wing', order = 'asc' } = req.query;

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.max(1, parseInt(limit, 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const limitValue = parseInt(parsedLimit, 10);
    const offsetValue = parseInt(offset, 10);

    if (isNaN(limitValue) || isNaN(offsetValue)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid pagination parameters. Ensure page and limit are numbers.',
      });
    }

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ` AND (r.full_name LIKE ? OR r.flat_number LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (wing) {
      whereClause += ` AND r.wing = ?`;
      params.push(wing);
    }

    if (flat_number) {
      whereClause += ` AND r.flat_number = ?`;
      params.push(flat_number);
    }

    const allowedSortFields = ['wing', 'flat_number', 'dues_amount', 'full_name'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'wing';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Residents r
      LEFT JOIN Users u ON r.user_id = u.id
      ${whereClause}
    `;
    const [countResult] = await db.execute(countQuery, params);
    const totalResidents = countResult[0].total;
    const totalPages = Math.ceil(totalResidents / limitValue);

    const dataQuery = `
      SELECT r.id, r.wing, r.flat_number, r.full_name, r.role, 
             IFNULL(r.dues_amount, 0.00) AS dues_amount, 
             r.contact_info, 
             u.email AS user_email
      FROM Residents r
      LEFT JOIN Users u ON r.user_id = u.id
      ${whereClause}
      ORDER BY r.${sortField} ${sortOrder}
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `;

    const [residents] = await db.execute(dataQuery, params);

    if (residents.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No residents found.',
      });
    }

    res.json({
      status: 'success',
      data: residents,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        totalResidents,
        totalPages
      },
    });
  } catch (error) {
    console.error('Error fetching residents:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching residents',
      error: error.message,
    });
  }
};


exports.addResident = async (req, res) => {
  try {
    const { full_name, wing, flat_number, role, contact_info, email, password } = req.body;

    if (!full_name || !wing || !flat_number || !role) {
      return res.status(400).json({ message: 'Full name, wing, flat number, and role are required.' });
    }

    if (!['Owner', 'Tenant', 'Family Member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided.' });
    }

    const flatId = `${wing}-${flat_number}`;

    const [existingResident] = await db.execute(
      'SELECT id FROM Residents WHERE flatId = ?',
      [flatId]
    );

    if (existingResident.length > 0) {
      return res.status(400).json({ message: 'Flat ID already exists.' });
    }

    let userId = null;

    if (email && password) {
      const [userResult] = await db.execute(
        `INSERT INTO Users (email, password, user_type, contact_info, is_active)
         VALUES (?, ?, 'Resident', ?, TRUE)`,
        [email, password, contact_info]
      );
      userId = userResult.insertId;
    }

    const [residentResult] = await db.execute(
      `INSERT INTO Residents (user_id, flatId, full_name, wing, flat_number, role, contact_info)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, flatId, full_name, wing, flat_number, role, contact_info]
    );

    res.status(201).json({
      status: 'success',
      message: 'Resident added successfully',
      residentId: residentResult.insertId,
      userId,
    });
  } catch (error) {
    console.error('Error adding resident:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding resident',
      error: error.message,
    });
  }
};



exports.updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, wing, flat_number, role, dues_amount, contact_info } = req.body;

    const fields = [];
    const values = [];

    if (full_name) fields.push('full_name = ?'), values.push(full_name);
    if (wing) fields.push('wing = ?'), values.push(wing);
    if (flat_number) fields.push('flat_number = ?'), values.push(flat_number);
    if (role) fields.push('role = ?'), values.push(role);
    if (dues_amount !== undefined) fields.push('dues_amount = ?'), values.push(dues_amount);
    if (contact_info) fields.push('contact_info = ?'), values.push(contact_info);

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields provided to update.' });
    }

    if (wing || flat_number) {
      const flatId = `${wing || ''}-${flat_number || ''}`;
      const [existingResident] = await db.execute(
        `SELECT id FROM Residents WHERE flatId = ? AND id != ?`,
        [flatId, id]
      );
      if (existingResident.length > 0) {
        return res.status(400).json({ message: 'Flat ID already exists.' });
      }
    }

    values.push(id);

    const [result] = await db.execute(
      `UPDATE Residents SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Resident not found.' });
    }

    res.json({ status: 'success', message: 'Resident updated successfully.' });
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating resident',
      error: error.message,
    });
  }
};


exports.getResidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [resident] = await db.execute(
      `SELECT r.id, r.full_name, r.wing, r.flat_number, r.role, 
              r.contact_info, r.dues_amount, 
              u.email AS user_email, u.contact_info AS user_contact_info
       FROM Residents r
       LEFT JOIN Users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [id]
    );

    if (resident.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Resident not found.' });
    }

    res.status(200).json({
      status: 'success',
      data: resident[0],
    });
  } catch (error) {
    console.error('Error fetching resident:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching resident',
      error: error.message,
    });
  }
};
