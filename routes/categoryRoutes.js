const express = require('express');
const router = express.Router();
const { Category, Product } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
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
      error: 'Server error'
    });
  }
});

// Admin: Create category
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, slug } = req.body;
    
    const category = await Category.create({
      name,
      description,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-')
    });
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Admin: Update category
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    const { name, description, slug } = req.body;
    
    await category.update({
      name: name || category.name,
      description: description || category.description,
      slug: slug || category.slug
    });
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Admin: Delete category
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.count({ where: { category_id: category.id } });
    
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category with ${productCount} products. Reassign products first.`
      });
    }
    
    await category.destroy();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router; 