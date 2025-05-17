const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Placeholder for category controllers (to be implemented)
const categoryController = {
  getCategories: (req, res) => {
    res.status(200).json({ message: 'Get all categories' });
  },
  getCategory: (req, res) => {
    res.status(200).json({ message: `Get category with id ${req.params.id}` });
  },
  createCategory: (req, res) => {
    res.status(201).json({ message: 'Category created' });
  },
  updateCategory: (req, res) => {
    res.status(200).json({ message: `Update category with id ${req.params.id}` });
  },
  deleteCategory: (req, res) => {
    res.status(200).json({ message: `Delete category with id ${req.params.id}` });
  }
};

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Protected admin routes
router.post('/', protect, authorize('admin'), categoryController.createCategory);
router.put('/:id', protect, authorize('admin'), categoryController.updateCategory);
router.delete('/:id', protect, authorize('admin'), categoryController.deleteCategory);

module.exports = router; 