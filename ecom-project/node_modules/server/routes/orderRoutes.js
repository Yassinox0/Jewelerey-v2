const express = require('express');
const { 
  createOrder, 
  getOrders, 
  getOrder, 
  updateOrder
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);

// Admin routes
router.put('/:id', adminOnly, updateOrder);

module.exports = router; 