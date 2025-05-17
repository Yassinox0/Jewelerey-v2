const User = require('../models/User');
const { Product, Category } = require('../models');

/**
 * @desc   Get all users
 * @route  GET /api/admin/users
 * @access Admin only
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Delete a user
 * @route  DELETE /api/admin/users/:id
 * @access Admin only
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Get all products
 * @route  GET /api/admin/products
 * @access Admin only
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Add a product
 * @route  POST /api/admin/products
 * @access Admin only
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, categoryId, inStock, featured } = req.body;

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      categoryId,
      inStock: inStock ?? true,
      featured: featured ?? false
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Update a product
 * @route  PUT /api/admin/products/:id
 * @access Admin only
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, categoryId, inStock, featured } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // If categoryId is provided, check if it exists
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }
    }

    // Update product
    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      image: image || product.image,
      categoryId: categoryId || product.categoryId,
      inStock: inStock !== undefined ? inStock : product.inStock,
      featured: featured !== undefined ? featured : product.featured
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Delete a product
 * @route  DELETE /api/admin/products/:id
 * @access Admin only
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Get all categories
 * @route  GET /api/admin/categories
 * @access Admin only
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Create a new category
 * @route  POST /api/admin/categories
 * @access Admin only
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    // Check if category with same slug exists
    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category with this slug already exists'
      });
    }

    const category = await Category.create({
      name,
      slug,
      description
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Update a category
 * @route  PUT /api/admin/categories/:id
 * @access Admin only
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // If slug is being changed, check if it already exists
    if (slug && slug !== category.slug) {
      const existingCategory = await Category.findOne({ where: { slug } });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: 'Category with this slug already exists'
        });
      }
    }

    // Update category
    await category.update({
      name: name || category.name,
      slug: slug || category.slug,
      description: description || category.description
    });

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc   Delete a category
 * @route  DELETE /api/admin/categories/:id
 * @access Admin only
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category has products
    const productsCount = await Product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with existing products'
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 