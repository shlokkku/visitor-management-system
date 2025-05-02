const db = require('../config/db');


async function getUserById(id) {
  const [rows] = await db.execute('SELECT * FROM Users WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { getUserById };