const jwt = require('jsonwebtoken');
const db = require('../config/db.js');

// Middleware to protect routes (authentication)
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from cookies or Authorization header
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token is found, return unauthorized
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from the database based on token's `id` and `role` field
    let user;
    if (decoded.role === 'Admin') {
      const [admins] = await db.execute('SELECT * FROM Admin WHERE id = ?', [
        decoded.id,
      ]);
      user = admins[0];
    } else if (decoded.role === 'Guard') {
      const [guards] = await db.execute('SELECT * FROM Guards WHERE id = ?', [
        decoded.id,
      ]);
      user = guards[0];
    } else if (decoded.role === 'Owner' || decoded.role === 'Tenant' || decoded.role === 'Family Member') {
      const [residents] = await db.execute(
        'SELECT * FROM Residents WHERE id = ?',
        [decoded.id]
      );
      user = residents[0];
    }

    // If no user is found, return unauthorized
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user and role to the request object
    req.user = {
      ...user,
      role: decoded.role, // Use the role directly from the token
    };

    next();
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware to authorize roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You do not have permission' });
    }
    next();
  };
};