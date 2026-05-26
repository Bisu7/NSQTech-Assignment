const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Protect all admin routes with authentication and admin role validation
router.use(requireAuth);
router.use(requireAdmin);

// User Management Routes
router.route('/users')
  .get(getUsers)
  .post(createUser);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
