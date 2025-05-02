const db = require('../config/db');


async function getPrimarySpotByFlat(flat_id) {
  const [rows] = await db.execute(
    `SELECT * FROM ParkingSpots WHERE assigned_flat_id = ? AND is_primary = TRUE LIMIT 1`, [flat_id]
  );
  return rows[0];
}


async function getSpotsByFlat(flat_id) {
  const [rows] = await db.execute(
    `SELECT * FROM ParkingSpots WHERE assigned_flat_id = ?`, [flat_id]
  );
  return rows;
}


async function getAvailableSpots(type = 'extra') {
  const [rows] = await db.execute(
    `SELECT * FROM ParkingSpots WHERE spot_type = ? AND is_assigned = FALSE`, [type]
  );
  return rows;
}


async function assignSpot(spot_id, vehicle_id, flat_id) {
  const [result] = await db.execute(
    `UPDATE ParkingSpots SET is_assigned = TRUE, assigned_vehicle_id = ?, assigned_flat_id = ?
     WHERE id = ? AND is_assigned = FALSE`, [vehicle_id, flat_id, spot_id]
  );
  return result.affectedRows > 0;
}


async function unassignSpot(spot_id) {
  await db.execute(
    `UPDATE ParkingSpots SET is_assigned = FALSE, assigned_vehicle_id = NULL WHERE id = ?`, [spot_id]
  );
}

module.exports = {
  getPrimarySpotByFlat,
  getSpotsByFlat,
  getAvailableSpots,
  assignSpot,
  unassignSpot
};