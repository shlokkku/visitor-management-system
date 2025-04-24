const db = require('../config/db'); // MySQL connection pool

const Guard = {
  // Create a new guard
  create: async ({ email, password, name, contact_info, shift_time }) => {
    const query = `
      INSERT INTO Guards (email, password, name, contact_info, shift_time)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [email, password, name, contact_info, shift_time || null]);
    return result.insertId; // Return the ID of the newly created guard
  },

  // Find a guard by email
  findByEmail: async (email) => {
    const query = `SELECT * FROM Guards WHERE email = ?`;
    const [rows] = await db.execute(query, [email]);
    return rows[0]; // Return the first guard found
  },

  // Additional methods (if needed)
  findById: async (id) => {
    const query = `SELECT * FROM Guards WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },

  update: async (id, { name, contact_info, shift_time }) => {
    const query = `
      UPDATE Guards
      SET name = ?, contact_info = ?, shift_time = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [name, contact_info, shift_time, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const query = `DELETE FROM Guards WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
    return result.affectedRows;
  },
};

module.exports = Guard;