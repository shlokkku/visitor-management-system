const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

const Complaint = require('../models/Complaint'); 

router.get('/overview', async (req, res) => {
  try {
  
    const [[{ residentCount }]] = await db.execute(
      'SELECT COUNT(*) as residentCount FROM Users WHERE user_type = "Resident"'
    );

    const unresolvedComplaints = await Complaint.countDocuments({ status: { $ne: "Resolved" } });


    const [[{ securityAlerts }]] = await db.execute(
      'SELECT COUNT(*) as securityAlerts FROM Alerts WHERE status = "active"'
    );


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
    console.error(err); 
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;