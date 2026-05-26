const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { name, userId, password, role } = req.body;

    // Basic validation
    if (!name || !userId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User ID already exists' });
    }

    const newUser = await User.create({
      name,
      userId,
      password,
      role: role || 'General User'
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        _id: newUser._id,
        name: newUser.name,
        userId: newUser.userId,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const { name, role, password } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = name || user.name;
    user.role = role || user.role;
    if (password) {
      user.password = password; // Should be hashed in a real app
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        userId: user.userId,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
