const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const productService = require('../services/productService');
const { ObjectId } = require('mongodb');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a search query'
      });
    }
    
    const products = await productService.searchProducts(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Get products by category slug
router.get('/category/slug/:slug', async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const result = await productService.getProductsByCategorySlug(slug);
    
    if (!result || !result.category) {
      return res.status(404).json({
        success: false,
        error: `Category with slug '${slug}' not found`
      });
    }
    
    res.status(200).json({
      success: true,
      category: result.category,
      count: result.products.length,
      data: result.products
    });
  } catch (error) {
    console.error('Error fetching products by category slug:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Get products by category ID
router.get('/category/:categoryId', async (req, res) => {
  try {
    let categoryId;
    try {
      categoryId = new ObjectId(req.params.categoryId);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category ID format'
      });
    }
    
    const products = await productService.getProductsByCategory(categoryId);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Admin: Create product
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const productData = req.body;
    
    // Convert category_id to ObjectId if provided as string
    if (productData.category_id && typeof productData.category_id === 'string') {
      productData.category_id = new ObjectId(productData.category_id);
    }
    
    const product = await productService.createProduct(productData);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Admin: Update product
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const productData = req.body;
    
    // Convert category_id to ObjectId if provided as string
    if (productData.category_id && typeof productData.category_id === 'string') {
      productData.category_id = new ObjectId(productData.category_id);
    }
    
    const product = await productService.updateProduct(req.params.id, productData);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Admin: Delete product
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

module.exports = router; 