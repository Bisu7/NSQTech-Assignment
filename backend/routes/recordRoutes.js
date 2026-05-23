const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// GET /api/records
// Admin gets all records, General User gets only assigned records
router.get('/', async (req, res) => {
  try {
    const { role, userId } = req.query; // in real app, these come from JWT
    
    let query = {};
    if (role === 'General User') {
      if (!userId) {
        return res.status(400).json({ message: 'User ID required for General User' });
      }
      query.assignedUser = userId;
    }

    const records = await Record.find(query).populate('assignedUser', 'name userId');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error });
  }
});

// GET /api/records/:id - Get single record
router.get('/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id).populate('assignedUser', 'name userId');
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching record', error });
  }
});

module.exports = router;
