const db = require('../config/db');

/**
 * Add a new notice (Admin only)
 * @route POST /api/notices
 */
exports.addNotice = async (req, res) => {
  try {
    const { title, content, expiration_date } = req.body;
    const posted_by = req.user.id; 

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const [result] = await db.execute(
      'INSERT INTO Notices (title, content, expiration_date, posted_by) VALUES (?, ?, ?, ?)',
      [title, content, expiration_date || null, posted_by]
    );

    res.status(201).json({ message: 'Notice added successfully', noticeId: result.insertId });
  } catch (error) {
    console.error('Add Notice Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update an existing notice (Admin only)
 * @route PUT /api/notices/:id
 */
exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, expiration_date, is_active } = req.body;

    // Ensure the notice exists
    const [notices] = await db.execute('SELECT * FROM Notices WHERE id = ?', [id]);
    if (notices.length === 0) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    await db.execute(
      'UPDATE Notices SET title = ?, content = ?, expiration_date = ?, is_active = ? WHERE id = ?',
      [title, content, expiration_date, is_active, id]
    );

    res.status(200).json({ data: notices });
  } catch (error) {
    console.error('Update Notice Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a notice (Admin only)
 * @route DELETE /api/notices/:id
 */
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;


    const [notices] = await db.execute('SELECT * FROM Notices WHERE id = ?', [id]);
    if (notices.length === 0) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    await db.execute('DELETE FROM Notices WHERE id = ?', [id]);

    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Delete Notice Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Fetch all notices (Admin only)
 * @route GET /api/notices
 */
exports.getAllNotices = async (req, res) => {
  try {
    const [notices] = await db.execute('SELECT * FROM Notices ORDER BY date_posted DESC');
    res.status(200).json(notices);
  } catch (error) {
    console.error('Fetch Notices Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Fetch all active notices (For Residents)
 * @route GET /api/notices/active
 */
exports.getActiveNotices = async (req, res) => {
  try {
    const [notices] = await db.execute(
      'SELECT id, title, content, date_posted, expiration_date FROM Notices WHERE is_active = TRUE AND (expiration_date IS NULL OR expiration_date >= NOW()) ORDER BY date_posted DESC'
    );
    res.status(200).json(notices);
  } catch (error) {
    console.error('Fetch Active Notices Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};