//controllers/noticeDues.js
const db = require('../config/db');

exports.getNotices = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM notices ORDER BY date_posted DESC LIMIT 20');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notices', error: err.message });
  }
};

exports.addNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title and content required" });
    const [result] = await db.execute(
      'INSERT INTO notices (title, content) VALUES (?, ?)', [title, content]
    );
    // For real-time: emit event (see below)
    req.io?.emit('noticeAdded', { id: result.insertId, title, content, date_posted: new Date() });
    res.status(201).json({ id: result.insertId, title, content });
  } catch (err) {
    res.status(500).json({ message: 'Error adding notice', error: err.message });
  }
};

