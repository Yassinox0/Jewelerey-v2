const express = require('express');
const { register, login, logout, getMe, createAdmin, checkAdmin, checkAdminDirect } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/create-admin', createAdmin);
router.post('/check-admin-direct', checkAdminDirect);

// Protected routes
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.get('/check-admin', protect, checkAdmin);

module.exports = router; 