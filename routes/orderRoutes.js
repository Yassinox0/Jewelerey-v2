const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product, User, Address } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// Get all orders for the current user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get a single order by ID (must belong to user or be admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Build the query based on user role
    const query = {
      where: { id: orderId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Address, as: 'shipping_address' }
      ]
    };
    
    // If not admin, restrict to user's own orders
    if (!req.user.role.includes('admin')) {
      query.where.user_id = req.user.id;
    }
    
    const order = await Order.findOne(query);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Create a new order (from cart)
router.post('/', protect, async (req, res) => {
  try {
    const { 
      items,
      payment_intent_id, 
      shipping_address_id,
      shipping_method,
      status = 'pending'
    } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No items in order'
      });
    }
    
    // Calculate order total from items
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product with ID ${item.product_id} not found`
        });
      }
      
      if (!product.in_stock) {
        return res.status(400).json({
          success: false,
          error: `Product '${product.name}' is out of stock`
        });
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.image
      });
    }
    
    // Apply shipping cost (simplified)
    const shipping_cost = shipping_method === 'express' ? 12.99 : 0;
    
    // Calculate tax (simplified - 10%)
    const tax = subtotal * 0.1;
    
    // Calculate total
    const total = subtotal + shipping_cost + tax;
    
    // Create the order
    const order = await Order.create({
      user_id: req.user.id,
      payment_intent_id,
      shipping_address_id,
      shipping_method,
      shipping_cost,
      tax,
      subtotal,
      total,
      status
    });
    
    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        ...item
      });
      
      // Update product inventory (simplified)
      const product = await Product.findByPk(item.product_id);
      if (product.quantity) {
        await product.update({ 
          quantity: product.quantity - item.quantity,
          in_stock: product.quantity - item.quantity > 0
        });
      }
    }
    
    // Get complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      data: completeOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Update order status (admin only)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    const { status } = req.body;
    
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }
    
    await order.update({ status });
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get all orders (admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router; 