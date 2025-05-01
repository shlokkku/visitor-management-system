const db = require('../config/db');

// Fetch resident details by flat ID
const getResidentByFlatId = async (flatId) => {
  if (!flatId) {
    throw new Error('Flat ID is required to fetch resident details.');
  }
  const [rows] = await db.execute('SELECT * FROM Residents WHERE flatId = ?', [flatId]);
  return rows[0];
};

// Fetch resident details by user_id
const getResidentByUserId = async (user_id) => {
  if (!user_id) {
    throw new Error('user_id is required to fetch resident details.');
  }
  const [rows] = await db.execute('SELECT * FROM Residents WHERE user_id = ?', [user_id]);
  return rows[0];
};

// Fetch resident by id (primary key)
const getResidentById = async (id) => {
  if (!id) {
    throw new Error('id is required to fetch resident details.');
  }
  const [rows] = await db.execute('SELECT * FROM Residents WHERE id = ?', [id]);
  return rows[0];
};

module.exports = {
  getResidentByFlatId,
  getResidentByUserId,
  getResidentById
};