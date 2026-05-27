const express = require('express');
const router = express.Router();
const { getRecords, getRecord, createRecord, updateRecord, deleteRecord } = require('../controllers/recordController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Protect all record routes
router.use(requireAuth);

// GET /api/records
router.get('/', getRecords);

// GET /api/records/:id
router.get('/:id', getRecord);

// Admin only routes for record management
router.post('/', requireAdmin, createRecord);
router.put('/:id', requireAdmin, updateRecord);
router.delete('/:id', requireAdmin, deleteRecord);

module.exports = router;
