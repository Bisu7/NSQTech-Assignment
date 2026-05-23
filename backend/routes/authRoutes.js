const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { userId, password, role } = req.body;
  try {
    const user = await User.findOne({ userId, role });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials or role mismatch' });
    }
    // Simple mock authentication response
    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        role: user.role
      },
      token: 'mock-jwt-token-12345'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error });
  }
});

module.exports = router;
