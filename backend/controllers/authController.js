const User = require('../models/User');

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
      return res.status(400).json({ message: 'User ID, password, and role are required' });
    }

    const user = await User.findOne({ userId, role });

    // Dummy authentication (plain text comparison for this assignment)
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials or role mismatch' });
    }

    // Dummy token generation
    const mockToken = `mock-token-${user._id}-${Date.now()}`;

    res.status(200).json({
      message: 'Login successful',
      token: mockToken,
      user: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/profile
const getProfile = async (req, res, next) => {
  try {
    // We expect the authMiddleware to have attached the dummy user to req.user
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getProfile
};
