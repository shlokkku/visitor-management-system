const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.execute('SELECT * FROM Users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = users[0]; // Attach user info to the request
    next();
  } catch (error) {
    console.error('Token Error:', error.message);
    res.status(401).json({ message: 'Not authorized', error: error.message });
  }
};

// Middleware to authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.user_type)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission' });
    }
    next();
  };
};

// Middleware to restrict access to admins only
exports.adminOnly = (req, res, next) => {
  if (req.user.user_type !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};