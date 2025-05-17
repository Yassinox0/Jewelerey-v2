const express = require('express');
const router = express.Router();
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
} = require('../controllers/cart');
const { protect } = require('../middleware/auth');

// All cart routes are protected
router.use(protect);

// Cart routes
router.get('/', getCart);
router.post('/items', addItem);
router.put('/items/:itemId', updateItem);
router.delete('/items/:itemId', removeItem);
router.delete('/', clearCart);

module.exports = router; 