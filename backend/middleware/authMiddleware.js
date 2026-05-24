const User = require('../models/User');

// Dummy authentication middleware
const requireAuth = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Since this is a dummy mock token, we expect the token format: mock-token-{userId}-{timestamp}
    // Let's parse the user ID from it.
    const parts = token.split('-');
    if (parts.length < 4 || parts[0] !== 'mock' || parts[1] !== 'token') {
      return res.status(401).json({ message: 'Not authorized, invalid token format' });
    }

    const userIdString = parts[2];

    const user = await User.findById(userIdString).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = {
  requireAuth
};
