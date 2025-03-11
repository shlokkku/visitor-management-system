// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Your MySQL connection

// Sign-up controller
exports.signup = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Check if user exists
    const [existingUsers] = await db.execute(
      'SELECT * FROM admin WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert user into database
    const [result] = await db.execute(
      'INSERT INTO admin (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, role || 'staff']
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, email, role: role || 'staff' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.status(201).json({
      message: 'User created successfully',
      admin: {
        id: result.insertId,
        email,
        name,
        role: role || 'staff'
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Sign-in controller
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [admin] = await db.execute(
      'SELECT * FROM admin WHERE email = ?',
      [email]
    );
    
    if (admin.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = admin[0];
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Sign-out controller
exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};