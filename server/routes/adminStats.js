const express = require('express');
const router = express.Router();
const db = require('../config/db'); // MySQL connection

// Import your MongoDB Complaint model (adjust path as needed)
const Complaint = require('../models/Complaint'); 

router.get('/overview', async (req, res) => {
  try {
    // 1. Residents (MySQL)
    const [[{ residentCount }]] = await db.execute(
      'SELECT COUNT(*) as residentCount FROM Users WHERE user_type = "Resident"'
    );

    // 2. Unresolved Complaints (MongoDB)
    // Adjust the query to match your 'status' field for unresolved
    const unresolvedComplaints = await Complaint.countDocuments({ status: { $ne: "Resolved" } });

    // 3. Security Alerts (MySQL)
    const [[{ securityAlerts }]] = await db.execute(
      'SELECT COUNT(*) as securityAlerts FROM Alerts WHERE status = "active"'
    );

    // 4. Due Payments (MySQL)
    const [[{ duePayments }]] = await db.execute(
      'SELECT COUNT(*) as duePayments FROM Dues WHERE status IN ("Pending", "Overdue")'
    );

    res.json({
      residentCount,
      unresolvedComplaints,
      securityAlerts,
      duePayments,
    });
  } catch (err) {
    console.error(err); // For debugging
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;