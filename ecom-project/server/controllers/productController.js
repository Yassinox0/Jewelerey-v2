const { Product, Category } = require('../models');

// Public: Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Public: Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }]
    });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Public: Get products by category slug
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { slug: req.params.categorySlug } });
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    const products = await Product.findAll({
      where: { category_id: category.id },
      include: [{ model: Category, as: 'category' }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Admin: Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, categoryId, inStock, featured } = req.body;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image,
      category_id: categoryId,
      in_stock: inStock ?? true,
      featured: featured ?? false
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Admin: Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, categoryId, inStock, featured } = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }
    }
    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      image: image || product.image,
      category_id: categoryId || product.category_id,
      in_stock: inStock !== undefined ? inStock : product.in_stock,
      featured: featured !== undefined ? featured : product.featured
    });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Admin: Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    await product.destroy();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}; 