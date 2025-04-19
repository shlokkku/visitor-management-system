// server/db.js or server/config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // replace with your actual MySQL username
  password: 'Bangtanb-123',  // replace with your actual MySQL password
  database: 'visitormanagement',  // using your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;