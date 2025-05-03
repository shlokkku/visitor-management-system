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
const notificationsRoutes = require('./routes/notifications'); 
const devicesRoutes = require('./routes/devices'); 
const adminStatsRoutes = require('./routes/adminStats');

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'uploads', 'documents');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Check for required environment variables
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

// Socket.IO Configuration with Dynamic CORS
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173', // Local development
        /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/, // Allow all Vercel subdomains
      ];

      // Check if the origin matches any of the allowed origins
      if (!origin || allowedOrigins.some((o) => (typeof o === 'string' ? o === origin : o.test(origin)))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Allow access to Socket.IO instance in routes
app.set("io", io);

// Express CORS Middleware Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173', // Local development
      /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/, // Allow all Vercel subdomains
    ];

    // Dynamically check if the origin is allowed
    if (!origin || allowedOrigins.some((o) => (typeof o === 'string' ? o === origin : o.test(origin)))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
};

// Apply Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Middleware to attach Socket.IO to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Route Definitions
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
app.use('/api/notifications', notificationsRoutes); 
app.use('/api/devices', devicesRoutes); 

// Root Route
app.get('/', (req, res) => res.send('Society Parking API'));

// Handle 404 Errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Socket.IO Event Handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user room: user_${userId}`);
  });

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

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
