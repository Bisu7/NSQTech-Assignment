const express = require('express');
const router = express.Router();
const { getRecords, getRecord } = require('../controllers/recordController');
const { requireAuth } = require('../middleware/authMiddleware');

// Protect all record routes
router.use(requireAuth);

// GET /api/records
router.get('/', getRecords);

// GET /api/records/:id
router.get('/:id', getRecord);

module.exports = router;
