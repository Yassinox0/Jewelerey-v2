const { Cart, CartItem, Product } = require('../models');

// Get user's active cart
exports.getCart = async (req, res) => {
  try {
    // Find active cart for the user
    let cart = await Cart.findOne({
      where: { 
        userId: req.user.id,
        status: 'active'
      },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image', 'stock']
            }
          ]
        }
      ]
    });

    // If no cart exists, create a new one
    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        status: 'active'
      });
      
      cart.items = [];
    }

    // Calculate cart total
    let total = 0;
    if (cart.items && cart.items.length > 0) {
      total = cart.items.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
      }, 0);
      
      // Update cart total
      await cart.update({ total });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists and is in stock
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }

    // Find or create user's active cart
    let [cart] = await Cart.findOrCreate({
      where: { 
        userId: req.user.id,
        status: 'active'
      },
      defaults: {
        userId: req.user.id,
        status: 'active',
        total: 0
      }
    });

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (cartItem) {
      // Update quantity if item exists
      const newQuantity = cartItem.quantity + parseInt(quantity);
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add more items than available in stock'
        });
      }
      
      await cartItem.update({
        quantity: newQuantity,
        price: product.price
      });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity: parseInt(quantity),
        price: product.price
      });
    }

    // Recalculate cart total
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id }
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);

    await cart.update({ total });

    // Get updated cart with items
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image', 'stock']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Update cart item quantity
exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate input
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Find the cart item
    const cartItem = await CartItem.findByPk(itemId, {
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { userId: req.user.id, status: 'active' }
        },
        {
          model: Product,
          as: 'product'
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check if quantity exceeds stock
    if (quantity > cartItem.product.stock) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add more items than available in stock'
      });
    }

    // Update quantity
    await cartItem.update({ quantity });

    // Recalculate cart total
    const cartItems = await CartItem.findAll({
      where: { cartId: cartItem.cartId }
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);

    await cartItem.cart.update({ total });

    // Get updated cart
    const updatedCart = await Cart.findByPk(cartItem.cartId, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image', 'stock']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find the cart item
    const cartItem = await CartItem.findByPk(itemId, {
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { userId: req.user.id, status: 'active' }
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const cartId = cartItem.cartId;

    // Delete the cart item
    await cartItem.destroy();

    // Recalculate cart total
    const cartItems = await CartItem.findAll({
      where: { cartId }
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);

    await Cart.update({ total }, { where: { id: cartId } });

    // Get updated cart
    const updatedCart = await Cart.findByPk(cartId, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image', 'stock']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    // Find user's active cart
    const cart = await Cart.findOne({
      where: { 
        userId: req.user.id,
        status: 'active'
      }
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Delete all cart items
    await CartItem.destroy({
      where: { cartId: cart.id }
    });

    // Reset cart total
    await cart.update({ total: 0 });

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: { id: cart.id, total: 0, items: [] }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 