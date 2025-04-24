const db = require('../config/db.js');

// Fetch resident details by flat ID
const getResidentByFlatId = async (flatId) => {
  if (!flatId) {
    throw new Error('Flat ID is required to fetch resident details');
  }

  // Query to find resident by flatId
  const [rows] = await db.execute('SELECT * FROM Residents WHERE flatId = ?', [flatId]);
  return rows[0];
};

module.exports = { getResidentByFlatId };