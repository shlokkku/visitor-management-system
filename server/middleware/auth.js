const jwt = require('jsonwebtoken');
const db = require('../config/db.js');

// Middleware to protect routes (authentication)
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Extract token
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    let user;
    if (decoded.role === 'admin') {
      const [admins] = await db.execute('SELECT * FROM Admin WHERE id = ?', [decoded.id]);
      console.log('Decoded ID:', decoded.id);
      console.log('Admin Query Result:', admins);
      user = admins[0];
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Normalize the role to match expected case
    req.user = { ...user, role: decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1) };
    next();
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware to authorize roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('User Role:', req.user.role);
    console.log('Allowed Roles:', roles);

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You do not have permission' });
    }
    next();
  };
};