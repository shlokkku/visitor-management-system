const db = require('../config/db');

const Alert = {
  create: async ({ type, message, unit, resident_id }) => {
    const [result] = await db.execute(
      'INSERT INTO Alerts (type, message, unit, resident_id, status, timestamp) VALUES (?, ?, ?, ?, "active", NOW())',
      [type, message, unit, resident_id]
    );
    const [rows] = await db.execute('SELECT * FROM Alerts WHERE id = ?', [result.insertId]);
    return rows[0];
  },
  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM Alerts WHERE id = ?', [id]);
    return rows[0];
  },
  getAll: async (status = null) => {
    let query = `SELECT a.*, r.full_name as resident_name, r.wing, r.flat_number 
                 FROM Alerts a 
                 LEFT JOIN Residents r ON a.resident_id = r.id`;
    let params = [];
    if (status) {
      query += " WHERE a.status = ?";
      params.push(status);
    }
    query += " ORDER BY a.timestamp DESC";
    const [rows] = await db.execute(query, params);
    return rows;
  },
  resolve: async (id) => {
    const [result] = await db.execute('UPDATE Alerts SET status = "resolved" WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Alert;