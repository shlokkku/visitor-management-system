const db = require('../config/db');

async function addVehicle({ flat_id, vehicle_type, vehicle_make, vehicle_model, license_plate, color }) {
  const [existing] = await db.execute(
    'SELECT id FROM Vehicles WHERE license_plate = ?', [license_plate]
  );
  if (existing.length) throw new Error('License plate already exists');
  const [result] = await db.execute(
    `INSERT INTO Vehicles (flat_id, vehicle_type, vehicle_make, vehicle_model, license_plate, color)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [flat_id, vehicle_type, vehicle_make, vehicle_model, license_plate, color]
  );
  return result.insertId;
}

async function getVehiclesByFlat(flat_id) {
  const [rows] = await db.execute(
    'SELECT * FROM Vehicles WHERE flat_id = ?', [flat_id]
  );
  return rows;
}

async function getVehicleById(id) {
  const [rows] = await db.execute(
    'SELECT * FROM Vehicles WHERE id = ?', [id]
  );
  return rows[0];
}

// Remove a vehicle (optional logic: unassign parking spot)
async function removeVehicle(id) {
  // Unassign the spot first
  await db.execute(
    'UPDATE ParkingSpots SET is_assigned = FALSE, assigned_vehicle_id = NULL WHERE assigned_vehicle_id = ?', [id]
  );
  // Remove the vehicle
  await db.execute('DELETE FROM Vehicles WHERE id = ?', [id]);
}

module.exports = { addVehicle, getVehiclesByFlat, getVehicleById, removeVehicle };