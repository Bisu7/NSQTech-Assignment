const Record = require('../models/Record');

// @desc    Get all records (Admin: all, General User: assigned only)
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res, next) => {
  try {
    const user = req.user;
    let query = {};

    // Role-based filtering
    if (user.role === 'General User') {
      query.assignedUser = user._id;
    }

    // Optional Pagination setup (e.g., ?page=1&limit=10)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Record.countDocuments(query);

    const records = await Record.find(query)
      .populate('assignedUser', 'name userId role')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single record
// @route   GET /api/records/:id
// @access  Private
const getRecord = async (req, res, next) => {
  try {
    const user = req.user;
    const record = await Record.findById(req.params.id).populate('assignedUser', 'name userId role');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    // If General User, ensure they own the record
    if (user.role === 'General User' && record.assignedUser._id.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this record' });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a record
// @route   POST /api/records
// @access  Private/Admin
const createRecord = async (req, res, next) => {
  try {
    const { title, description, accessLevel, assignedUser } = req.body;
    
    if (!title || !description || !accessLevel || !assignedUser) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const record = await Record.create({
      title,
      description,
      accessLevel,
      assignedUser
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a record
// @route   PUT /api/records/:id
// @access  Private/Admin
const updateRecord = async (req, res, next) => {
  try {
    let record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a record
// @route   DELETE /api/records/:id
// @access  Private/Admin
const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    await record.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord
};
