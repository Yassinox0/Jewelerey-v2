const express = require('express');
const { createProfile, getProfile, makeUserAdmin } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes - require authentication
router.use(protect);
router.post('/create-profile', createProfile);
router.get('/me', getProfile);

// Admin routes - require admin privileges
router.put('/make-admin', authorize('admin'), makeUserAdmin);

module.exports = router; 