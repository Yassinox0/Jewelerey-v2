const { Product, Category, Review, User } = require('../models');
const { Op } = require('sequelize');

// Get all products with filtering
exports.getProducts = async (req, res) => {
  try {
    const { 
      keyword = '', 
      category, 
      min_price, 
      max_price, 
      sort = 'createdAt', 
      order = 'DESC',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter conditions
    const filterConditions = {
      [Op.and]: [
        keyword ? {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { description: { [Op.like]: `%${keyword}%` } }
          ]
        } : null,
        category ? { categoryId: category } : null,
        min_price ? { price: { [Op.gte]: min_price } } : null,
        max_price ? { price: { [Op.lte]: max_price } } : null
      ].filter(Boolean)
    };

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Get products with filtering and pagination
    const { count, rows: products } = await Product.findAndCountAll({
      where: Object.keys(filterConditions[Op.and]).length > 0 ? filterConditions : {},
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: [[sort, order]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Pagination info
    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages ? parseInt(page) + 1 : null;
    const prevPage = page > 1 ? parseInt(page) - 1 : null;

    res.status(200).json({
      success: true,
      count,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        nextPage,
        prevPage,
        limit: parseInt(limit)
      },
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, image } = req.body;

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
      image: image || 'default-product.jpg'
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, image } = req.body;

    let product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      stock: stock !== undefined ? stock : product.stock,
      categoryId: categoryId || product.categoryId,
      image: image || product.image
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 