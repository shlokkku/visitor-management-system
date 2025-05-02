const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const connectMongo = require('./config/db.mongo');
const visitorLogRoutes = require('./routes/visitorLogs');
const authRoutes = require('./routes/auth');
const duesRoutes = require('./routes/dues');
const noticeRoutes = require('./routes/notices');
const guardRoutes = require('./routes/guards');
const residentRoutes = require('./routes/residents');
const complaintsRoutes = require('./routes/complaints');
const parkingRoutes = require('./routes/parking');
const documentRoutes = require('./routes/documents');
const alertRoutes = require('./routes/alert');
const adminRoutes = require('./routes/admin');
const notificationsRoutes = require('./routes/notifications'); // <-- NEW
const devicesRoutes = require('./routes/devices'); // <-- NEW
const adminStatsRoutes = require('./routes/adminStats');

require('dotenv').config();

// --------- ADD THIS BLOCK AT THE VERY TOP (after require statements) ---------
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'uploads', 'documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// -----------------------------------------------------------------------------

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
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io available in controllers
app.set("io", io);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Attach Socket.IO to requests (optional, if you want to access via req.io)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dues', duesRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/visitorlogs', visitorLogRoutes);
app.use('/api/guards', guardRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/parking', parkingRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/stats', adminStatsRoutes);

app.use('/api/notifications', notificationsRoutes); // <-- NEW
app.use('/api/devices', devicesRoutes); // <-- NEW

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

// --- Socket.IO events for joining rooms for real-time notifications ---
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // After login, client should send their userId to join their personal room
  socket.on('join-user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user room: user_${userId}`);
  });

  // Optionally, join by role for admin/guard/broadcast
  socket.on('join-role', (role) => {
    if (role === 'Admin') socket.join('admins');
    if (role === 'Guard') socket.join('guards');
    if (role === 'Resident') socket.join('residents');
    console.log(`Socket ${socket.id} joined role room: ${role}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});