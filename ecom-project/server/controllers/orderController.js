const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

/**
 * Create a new order
 * @route POST /api/orders
 * @access Private
 */
exports.createOrder = async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { items, shippingAddress, paymentMethod, total } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No items in order'
      });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Shipping address is required'
      });
    }
    
    const db = getDB();
    const ordersCollection = db.collection('orders');
    
    // Create new order
    const order = {
      userId: uid,
      userEmail: email,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      status: 'processing',
      total: parseFloat(total) || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await ordersCollection.insertOne(order);
    
    // Get the created order with its ID
    const createdOrder = await ordersCollection.findOne({ _id: result.insertedId });
    
    res.status(201).json({
      success: true,
      order: createdOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all orders for current user
 * @route GET /api/orders
 * @access Private
 */
exports.getOrders = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const db = getDB();
    const ordersCollection = db.collection('orders');
    
    // Get all orders for the current user
    const orders = await ordersCollection
      .find({ userId: uid })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a single order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
exports.getOrder = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    
    // Validate MongoDB ID format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }
    
    const db = getDB();
    const ordersCollection = db.collection('orders');
    
    // Find order by ID and user ID to ensure the user can only access their own orders
    const order = await ordersCollection.findOne({
      _id: new ObjectId(id),
      userId: uid
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update order status (admin only)
 * @route PUT /api/orders/:id
 * @access Private/Admin
 */
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate MongoDB ID format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }
    
    const db = getDB();
    const ordersCollection = db.collection('orders');
    
    // Update order status
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Get the updated order
    const updatedOrder = await ordersCollection.findOne({ _id: new ObjectId(id) });
    
    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 