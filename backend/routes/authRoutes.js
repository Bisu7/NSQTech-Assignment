const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile
router.get('/profile', requireAuth, getProfile);

module.exports = router;
