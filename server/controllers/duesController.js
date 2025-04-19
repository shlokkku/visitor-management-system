const db = require('../config/db');

exports.getPendingDues = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, tenant_id, tenant_name, amount, due_date FROM dues WHERE status = "Pending" ORDER BY due_date ASC LIMIT 20'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dues', error: err.message });
  }
};

exports.addDue = async (req, res) => {
  try {
    const { tenant_id, tenant_name, amount, due_date } = req.body;
    if (!tenant_id || !tenant_name || !amount || !due_date)
      return res.status(400).json({ message: "All fields required" });
    const [result] = await db.execute(
      'INSERT INTO dues (tenant_id, tenant_name, amount, due_date) VALUES (?, ?, ?, ?)',
      [tenant_id, tenant_name, amount, due_date]
    );
    // For real-time: emit event (see below)
    req.io?.emit('dueAdded', { id: result.insertId, tenant_id, tenant_name, amount, due_date });
    res.status(201).json({ id: result.insertId, tenant_id, tenant_name, amount, due_date });
  } catch (err) {
    res.status(500).json({ message: 'Error adding due', error: err.message });
  }
};
