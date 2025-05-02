const parkingModel = require('../models/parkingModel');
const vehicleModel = require('../models/vehicleModel');
const db = require('../config/db');


exports.getMyParking = async (req, res) => {
  try {
    const flat_id = req.user.linked_id;

   
    const [vehicles] = await db.execute(
      `SELECT v.*, ps.spot_number AS assigned_spot_number, ps.spot_type AS assigned_spot_type
       FROM Vehicles v
       LEFT JOIN ParkingSpots ps ON ps.assigned_vehicle_id = v.id
       WHERE v.flat_id = ?`,
      [flat_id]
    );

    
    const [spots] = await db.execute(
      `SELECT * FROM ParkingSpots WHERE assigned_flat_id = ?`,
      [flat_id]
    );

    res.json({ spots, vehicles });
  } catch (err) {
    res.status(500).json({ message: "Error fetching parking info", error: err.message });
  }
};


exports.addVehicle = async (req, res) => {
  try {
    const flat_id = req.user.linked_id;
    const { vehicle_type, vehicle_make, vehicle_model, license_plate, color } = req.body;
    const vehicleId = await vehicleModel.addVehicle({
      flat_id, vehicle_type, vehicle_make, vehicle_model, license_plate, color
    });


    const primarySpot = await parkingModel.getPrimarySpotByFlat(flat_id);

    if (primarySpot && !primarySpot.is_assigned) {
      await parkingModel.assignSpot(primarySpot.id, vehicleId, flat_id);
      return res.status(201).json({ id: vehicleId, message: "Vehicle added and primary spot assigned." });
    }

    res.status(201).json({ id: vehicleId, message: "Vehicle added. Please contact admin for extra parking spot assignment." });
  } catch (err) {
    res.status(400).json({ message: err.message || "Error adding vehicle" });
  }
};


exports.getMyVehicles = async (req, res) => {
  try {
    const flat_id = req.user.linked_id;
    const [vehicles] = await db.execute(
      `SELECT v.*, ps.spot_number AS assigned_spot_number, ps.spot_type AS assigned_spot_type
       FROM Vehicles v
       LEFT JOIN ParkingSpots ps ON ps.assigned_vehicle_id = v.id
       WHERE v.flat_id = ?`,
      [flat_id]
    );
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vehicles", error: err.message });
  }
};


exports.removeVehicle = async (req, res) => {
  try {
    const { vehicle_id } = req.params;
    const vehicle = await vehicleModel.getVehicleById(vehicle_id);
    if (!vehicle || vehicle.flat_id !== req.user.linked_id) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    await vehicleModel.removeVehicle(vehicle_id);
    res.json({ message: "Vehicle and any assigned parking spot removed." });
  } catch (err) {
    res.status(500).json({ message: "Error removing vehicle", error: err.message });
  }
};


exports.getAllParking = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        r.id AS resident_id, r.full_name, r.wing, r.flat_number,
        ps.id AS spot_id, ps.spot_number, ps.spot_type, ps.is_primary, ps.is_assigned,
        ps.assigned_vehicle_id,
        v.id AS vehicle_id, v.vehicle_make, v.vehicle_model, v.license_plate, v.vehicle_type, v.color
      FROM Residents r
      LEFT JOIN ParkingSpots ps ON ps.assigned_flat_id = r.id
      LEFT JOIN Vehicles v ON v.id = ps.assigned_vehicle_id
      ORDER BY r.wing, r.flat_number, ps.spot_number
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all parking info", error: err.message });
  }
};


exports.getAllSpots = async (req, res) => {
  try {
    let sql = `SELECT * FROM ParkingSpots WHERE 1=1`;
    const params = [];
    if (req.query.type) {
      sql += ` AND spot_type = ?`;
      params.push(req.query.type);
    }
    if (typeof req.query.assigned !== "undefined") {
      sql += ` AND is_assigned = ?`;
      params.push(req.query.assigned === 'true' ? 1 : 0);
    }
    const [spots] = await db.execute(sql, params);
    res.json(spots);
  } catch (err) {
    res.status(500).json({ message: "Error fetching spots", error: err.message });
  }
};


exports.assignSpot = async (req, res) => {
  try {
    const { spot_id, vehicle_id } = req.body;
    const vehicle = await vehicleModel.getVehicleById(vehicle_id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    const success = await parkingModel.assignSpot(spot_id, vehicle_id, vehicle.flat_id);
    if (!success) return res.status(400).json({ message: "Spot already assigned or does not exist" });
    res.json({ message: "Spot assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error assigning spot", error: err.message });
  }
};

exports.unassignSpot = async (req, res) => {
  try {
    const { spot_id } = req.body;
    await parkingModel.unassignSpot(spot_id);
    res.json({ message: "Spot has been unassigned." });
  } catch (err) {
    res.status(500).json({ message: "Error unassigning spot", error: err.message });
  }
};