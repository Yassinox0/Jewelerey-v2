const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { Review, User, Product } = require('../models');

// Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.findAll({
      where: { product_id: productId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get a single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Create a review (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    
    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      where: { 
        user_id: req.user.id,
        product_id
      }
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this product'
      });
    }
    
    // Create the review
    const review = await Review.create({
      product_id,
      user_id: req.user.id,
      rating,
      comment
    });
    
    // Update product's average rating
    const allReviews = await Review.findAll({
      where: { product_id }
    });
    
    const avgRating = allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length;
    
    await product.update({
      rating: avgRating,
      review_count: allReviews.length
    });
    
    // Return the review with user data
    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
    });
    
    res.status(201).json({
      success: true,
      data: fullReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Update a review (protected - only owner)
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Check if user owns the review
    if (review.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this review'
      });
    }
    
    const { rating, comment } = req.body;
    
    await review.update({
      rating: rating || review.rating,
      comment: comment || review.comment
    });
    
    // Update product's average rating
    const product = await Product.findByPk(review.product_id);
    const allReviews = await Review.findAll({
      where: { product_id: review.product_id }
    });
    
    const avgRating = allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length;
    
    await product.update({
      rating: avgRating
    });
    
    // Return the updated review with user data
    const updatedReview = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
    });
    
    res.status(200).json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Delete a review (protected - only owner)
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Check if user owns the review
    if (review.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }
    
    // Save product_id before deleting the review
    const productId = review.product_id;
    
    await review.destroy();
    
    // Update product's average rating
    const product = await Product.findByPk(productId);
    const allReviews = await Review.findAll({
      where: { product_id: productId }
    });
    
    // Calculate new average rating or set to 0 if no reviews left
    let avgRating = 0;
    if (allReviews.length > 0) {
      avgRating = allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length;
    }
    
    await product.update({
      rating: avgRating,
      review_count: allReviews.length
    });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Admin: Get pending reviews
router.get('/admin/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { status: 'pending' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Product, as: 'product', attributes: ['id', 'name'] }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error getting pending reviews:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: Update review status
router.put('/admin/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either approved or rejected'
      });
    }
    
    await review.update({ status });
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router; 