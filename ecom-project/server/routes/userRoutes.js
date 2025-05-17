const express = require('express');
const { createProfile, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protected routes - require authentication
router.use(protect);
router.post('/create-profile', createProfile);
router.get('/me', getProfile);

module.exports = router; 