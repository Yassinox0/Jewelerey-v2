const Cart = require('../models/Cart');

/**
 * @desc   Get user's cart
 * @route  GET /api/cart
 * @access Private
 */
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      // Create a new cart if not found
      const newCart = await Cart.create({
        userId: req.user.id,
        items: [],
        totalQuantity: 0,
        totalAmount: 0
      });

      return res.status(200).json({
        success: true,
        data: newCart
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Add item to cart
 * @route  POST /api/cart
 * @access Private
 */
exports.addToCart = async (req, res) => {
  try {
    const { product, quantity = 1 } = req.body;

    if (!product || !product.id) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid product'
      });
    }

    let cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      // Create a new cart if not found
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
        totalQuantity: 0,
        totalAmount: 0
      });
    }

    let items = cart.items || [];
    let totalQuantity = cart.totalQuantity || 0;
    let totalAmount = cart.totalAmount || 0;

    // Check if item already exists in cart
    const existingItemIndex = items.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
      // Update existing item
      items[existingItemIndex].quantity += quantity;
      items[existingItemIndex].total = items[existingItemIndex].price * items[existingItemIndex].quantity;
    } else {
      // Add new item
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        total: product.price * quantity
      });
    }

    // Calculate totals
    totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    // Update cart
    cart = await cart.update({
      items,
      totalQuantity,
      totalAmount
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Update cart item quantity
 * @route  PUT /api/cart/:id
 * @access Private
 */
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid quantity'
      });
    }

    let cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    let items = cart.items || [];

    // Find the item to update
    const itemIndex = items.findIndex(item => item.id === parseInt(productId));

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    // Update item quantity and total
    items[itemIndex].quantity = quantity;
    items[itemIndex].total = items[itemIndex].price * quantity;

    // Calculate totals
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    // Update cart
    cart = await cart.update({
      items,
      totalQuantity,
      totalAmount
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Remove item from cart
 * @route  DELETE /api/cart/:id
 * @access Private
 */
exports.removeFromCart = async (req, res) => {
  try {
    const productId = req.params.id;

    let cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    let items = cart.items || [];

    // Filter out the item to remove
    const updatedItems = items.filter(item => item.id !== parseInt(productId));

    if (items.length === updatedItems.length) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    // Calculate totals
    const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);

    // Update cart
    cart = await cart.update({
      items: updatedItems,
      totalQuantity,
      totalAmount
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Clear cart
 * @route  DELETE /api/cart
 * @access Private
 */
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    // Clear cart
    cart = await cart.update({
      items: [],
      totalQuantity: 0,
      totalAmount: 0
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 