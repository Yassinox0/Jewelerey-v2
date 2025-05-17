const express = require('express');
const { register, login, logout, getMe, createAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/create-admin', createAdmin);

// Protected routes
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router; 