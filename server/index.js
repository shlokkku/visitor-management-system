// Import required packages
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Initialize express app
const app = express();

// Security middleware
app.use(helmet()); // Add security headers
app.use(express.json({ limit: '10kb' })); // Limit JSON body size
app.use(cookieParser());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many attempts, please try again after 15 minutes'
});

// Apply rate limiting to auth routes
app.use('/api/auth', authLimiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database connection pool with optimized settings
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'visitormanagement',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();

// Create a token and set cookie
const createSendToken = (user, statusCode, res) => {
  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
    }
  );
  
  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  };
  
  // Remove password from output
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  
  // Set cookie and send response
  res.cookie('token', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    user: userWithoutPassword
  });
};

// Authentication middleware
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in cookies or Authorization header
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Your token has expired. Please log in again.' 
      });
    }
    
    // Get user from database
    const [admin] = await pool.execute(
      'SELECT id, email, name, role, created_at FROM admin WHERE id = ?',
      [decoded.id]
    );
    
    if (admin.length === 0) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'The user belonging to this token no longer exists.' 
      });
    }
    
    // Check if user changed password after the token was issued
    const [passwordChanges] = await pool.execute(
      'SELECT updated_at FROM admin WHERE id = ? AND updated_at > FROM_UNIXTIME(?)',
      [decoded.id, decoded.iat]
    );
    
    if (passwordChanges.length > 0) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'User recently changed password. Please log in again.' 
      });
    }
    
    // Grant access to protected route
    req.user = admin[0];
    next();
  } catch (error) {
    console.error('Auth error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Invalid token. Please log in again.' 
      });
    }
    res.status(401).json({ 
      status: 'fail',
      message: 'Authentication failed. Please log in again.' 
    });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'fail',
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};

// Input validation
const validateSignup = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter'),
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
];

const validateSignin = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'fail',
      errors: errors.array() 
    });
  }
  next();
};

// Routes
// Sign-up route
app.post(
  '/api/auth/signup', 
  validateSignup,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      
      // Begin transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      
      try {
        // Check if user exists
        const [existingUsers] = await connection.execute(
          'SELECT id FROM admin WHERE email = ?',
          [email]
        );
        
        if (existingUsers.length > 0) {
          await connection.rollback();
          connection.release();
          return res.status(400).json({ 
            status: 'fail',
            message: 'Email is already in use' 
          });
        }
        
        // Validate role
        const allowedRoles = ['user', 'staff', 'admin'];
        const userRole = role && allowedRoles.includes(role) ? role : 'user';
        
        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert user into database
        const [result] = await connection.execute(
          `INSERT INTO admin (email, password, name, role, created_at, updated_at) 
           VALUES (?, ?, ?, ?, NOW(), NOW())`,
          [email, hashedPassword, name, userRole]
        );
        
        // Commit transaction
        await connection.commit();
        connection.release();
        
        // Create user object
        const user = {
          id: result.insertId,
          email,
          name,
          role: userRole
        };
        
        // Log activity
        console.log(`New user registered: ${email} with role ${userRole}`);
        
        // Send token and user data
        createSendToken(user, 201, res);
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to register user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Sign-in route
app.post(
  '/api/auth/signin',
  validateSignin,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const [admin] = await pool.execute(
        'SELECT * FROM admin WHERE email = ?',
        [email]
      );
      
      if (admin.length === 0) {
        return res.status(401).json({ 
          status: 'fail',
          message: 'Invalid email or password' 
        });
      }
      
      const user = admin[0];
      
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Update failed login attempts (as an enhancement)
        return res.status(401).json({ 
          status: 'fail',
          message: 'Invalid email or password' 
        });
      }
      
      // Log activity
      console.log(`User logged in: ${email}`);
      
      // Send token
      createSendToken(user, 200, res);
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to log in',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Sign-out route
app.post('/api/auth/signout', (req, res) => {
  // Clear cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.status(200).json({ 
    status: 'success',
    message: 'Logged out successfully' 
  });
});

// Change password route
app.post('/api/auth/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        status: 'fail',
        message: 'New password must be at least 8 characters long'
      });
    }
    
    // Get user with password
    const [admin] = await pool.execute(
      'SELECT * FROM admin WHERE id = ?',
      [req.user.id]
    );
    
    if (admin.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    const user = admin[0];
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await pool.execute(
      'UPDATE admin SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, req.user.id]
    );
    
    // Send success response
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update password'
    });
  }
});

// Protected route - Get current user
app.get('/api/auth/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    user: req.user
  });
});

// Admin route - Get all users
app.get('/api/admin/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const [admin] = await pool.execute(
      'SELECT id, email, name, role, created_at, updated_at FROM admin'
    );
    
    res.status(200).json({
      status: 'success',
      results: admin.length,
      admin
    });
  } catch (error) {
    console.error('Admin admin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve admin'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

// Start the server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`
    ====================================
    🚀 Server running on port ${PORT}
    📁 Environment: ${process.env.NODE_ENV || 'development'}
    ====================================
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  app.close(() => {
    console.log('Process terminated');
  });
});