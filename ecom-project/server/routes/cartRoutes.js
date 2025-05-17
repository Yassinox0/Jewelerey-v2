const express = require('express');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart)         // Get cart
  .post(addToCart)      // Add to cart
  .delete(clearCart);   // Clear cart

router.route('/:id')
  .put(updateCartItem)    // Update cart item quantity
  .delete(removeFromCart); // Remove from cart

module.exports = router; 