const sequelize = require('../config/database');
const Product = require('./Product');
const Category = require('./Category');
const User = require('./User');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');
const Address = require('./Address');
const Notification = require('./Notification');

// Define associations
try {
  // Products belong to Categories
  Product.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  // Categories have many Products
  Category.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'products',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  // User has one Cart
  User.hasOne(Cart, {
    foreignKey: 'user_id',
    as: 'cart',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // Cart belongs to User
  Cart.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // Cart has many CartItems
  Cart.hasMany(CartItem, {
    foreignKey: 'cart_id',
    as: 'items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // CartItem belongs to Cart
  CartItem.belongsTo(Cart, {
    foreignKey: 'cart_id',
    as: 'cart',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // CartItem belongs to Product
  CartItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  // User has many Orders
  User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'orders',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // Order belongs to User
  Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // Order has many OrderItems
  Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    as: 'items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // OrderItem belongs to Order
  OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // OrderItem belongs to Product
  OrderItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  // Review associations
  Review.belongsTo(User, { 
    foreignKey: 'user_id',
    as: 'user'
  });
  User.hasMany(Review, { 
    foreignKey: 'user_id',
    as: 'reviews'
  });

  Review.belongsTo(Product, { 
    foreignKey: 'product_id',
    as: 'product'
  });
  Product.hasMany(Review, { 
    foreignKey: 'product_id',
    as: 'reviews'
  });

  // Address associations
  Address.belongsTo(User, { 
    foreignKey: 'user_id',
    as: 'user'
  });
  User.hasMany(Address, { 
    foreignKey: 'user_id',
    as: 'addresses'
  });

  // Notification associations
  Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  User.hasMany(Notification, {
    foreignKey: 'user_id',
    as: 'notifications'
  });

  console.log('Model associations defined successfully');
} catch (error) {
  console.error('Error defining model associations:', error);
  throw error;
}

// Function to sync all models with the database
const syncDatabase = async (force = false) => {
  try {
    console.log('Starting database synchronization...');
    await sequelize.sync({ force });
    console.log('Database synchronized successfully');
    return true;
  } catch (error) {
    console.error('Error synchronizing database:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    return false;
  }
};

module.exports = {
  sequelize,
  Product,
  Category,
  User,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Review,
  Address,
  Notification,
  syncDatabase
}; 