const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const connectMongo = require('./config/db.mongo');
const visitorLogRoutes = require('./routes/visitorLogs');
const authRoutes = require('./routes/auth');
const duesRoutes = require('./routes/dues');
const noticeRoutes = require('./routes/notices');
const guardRoutes = require('./routes/guards');
const residentRoutes = require('./routes/residents');
const complaintsRoutes = require('./routes/complaints');
const parkingRoutes = require('./routes/parking');
const session = require("express-session");
// const passport = require("passport");
// require('./config/passport');

// Check for critical environment variables
if (!process.env.CLIENT_URL) {
  throw new Error('CLIENT_URL is not defined in environment variables');
}
if (!process.env.PORT) {
  console.warn('PORT is not defined in environment variables. Using default port 5000.');
}

// Connect to MongoDB
connectMongo();

const app = express();

// ✅ Disable CSP for testing
app.use(helmet({
  contentSecurityPolicy: false
}));


const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: process.env.CLIENT_URL } });

// Set CSP headers in Express app
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com; " +
    "connect-src 'self' https://accounts.google.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:;"
  );
  next();
});



// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || '86e1f23a88cd21526a190dae675f213d4bbce32a788eeb26fec7a0d8392a3add',  // Secret key from the environment or fallback
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // Secure cookies only in production
    httpOnly: true,  // Protect cookies from JS access
    sameSite: 'None', // Allow cross-site cookies for CORS
    maxAge: 3600000  // 1-hour session expiration
  }
}));

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Attach Socket.IO to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api', authRoutes); // Authentication routes (Resident, Admin, Guard)
app.use('/api/dues', duesRoutes); // Dues-related routes
app.use('/api/notices', noticeRoutes); // Notices-related routes
app.use('/api/visitorlogs', visitorLogRoutes); // Visitor log routes
app.use('/api/guards', guardRoutes); // Guard-related routes
app.use('/api/residents', residentRoutes); // Resident-related routes
app.use('/api/complaints', complaintsRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/parking', parkingRoutes);
app.get('/', (req, res) => res.send('Society Parking API'));
// Handle unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});


// Socket.IO events
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});