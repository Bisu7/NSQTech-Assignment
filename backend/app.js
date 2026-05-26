const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Async Delay Simulation Middleware
app.use((req, res, next) => {
  const delay = req.query.delay ? parseInt(req.query.delay) : 0;
  if (delay > 0) {
    setTimeout(next, delay);
  } else {
    next();
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/admin', adminRoutes);

// Async Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ 
    message: 'An unexpected error occurred on the server.',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

module.exports = app;
