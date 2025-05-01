const db = require('../config/db');

// Fetch user by id from MySQL
async function getUserById(id) {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { getUserById };