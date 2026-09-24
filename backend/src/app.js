const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const courseRoutes = require('./routes/courseRoutes');
const counsellorRoutes = require('./routes/counsellorRoutes');
const followUpRoutes = require('./routes/followUpRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'online',
    online: true,
    dbConnected: mongoose.connection.readyState === 1,
    service: 'Admission Lead Management API',
    timestamp: new Date(),
  });
});

// Database Connection Guard Middleware
app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();

  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    const connectDB = require('./config/db');
    try {
      await connectDB();
    } catch (e) {}
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database server is initializing. Please retry in a moment.',
      isDbConnecting: true,
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/counsellors', counsellorRoutes);
app.use('/api/followups', followUpRoutes);
app.use('/api/reports', reportRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message || err);

  const isDbErr = err.name === 'MongooseServerSelectionError' ||
    err.name === 'MongoNetworkError' ||
    (err.message && (err.message.includes('ECONNREFUSED') || err.message.includes('timed out')));

  if (isDbErr) {
    return res.status(503).json({
      success: false,
      message: 'Backend is connecting to MongoDB (mongodb://127.0.0.1:27017). Verify MongoDB service is running.',
      isDbConnecting: true,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
