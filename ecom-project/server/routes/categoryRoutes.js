const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const categoryService = require('../services/categoryService');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Get single category by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Admin: Create category
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, slug } = req.body;
    
    const categoryData = {
      name,
      description,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-')
    };
    
    const category = await categoryService.createCategory(categoryData);
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Admin: Update category
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, slug } = req.body;
    
    const categoryData = {};
    if (name) categoryData.name = name;
    if (description) categoryData.description = description;
    if (slug) categoryData.slug = slug;
    
    const category = await categoryService.updateCategory(req.params.id, categoryData);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Admin: Delete category
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    try {
      await categoryService.deleteCategory(req.params.id);
      
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      if (error.message.includes('Cannot delete category')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

module.exports = router; 