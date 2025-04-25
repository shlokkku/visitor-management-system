const db = require('../config/db');

const Guard = {
  // Create a new guard
  create: async ({ user_id, name, contact_info, shift_time }) => {
    const query = `
      INSERT INTO Guards (user_id, name, contact_info, shift_time)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [user_id, name, contact_info, shift_time || null]);
    return result.insertId;
  },

  // Find a guard by user_id
  findByUserId: async (user_id) => {
    const query = `SELECT * FROM Guards WHERE user_id = ?`;
    const [rows] = await db.execute(query, [user_id]);
    return rows[0];
  },
};

module.exports = Guard;