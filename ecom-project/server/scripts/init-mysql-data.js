const sequelize = require('../config/database');
const { Category, Product } = require('../models');
const setupDatabase = require('./setup-mysql-db');

// Sample categories
const categories = [
  { name: 'Necklaces', slug: 'necklaces', description: 'Elegant necklaces for all occasions' },
  { name: 'Rings', slug: 'rings', description: 'Beautiful rings for every finger' },
  { name: 'Earrings', slug: 'earrings', description: 'Stunning earrings to complete your look' },
  { name: 'Bracelets', slug: 'bracelets', description: 'Stylish bracelets for any wrist' },
  { name: 'Watches', slug: 'watches', description: 'Luxurious watches for every style' }
];

// Sample products
const products = [
  {
    name: 'Diamond Pendant Necklace',
    description: 'Beautiful diamond pendant necklace with 14k gold chain',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad571762?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    categoryId: 1, // Will reference Necklaces
    inStock: true,
    featured: true
  },
  {
    name: 'Gold Hoop Earrings',
    description: 'Classic gold hoop earrings, perfect for everyday wear',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    categoryId: 3, // Will reference Earrings
    inStock: true,
    featured: true
  },
  {
    name: 'Silver Tennis Bracelet',
    description: 'Elegant silver tennis bracelet with cubic zirconia',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    categoryId: 4, // Will reference Bracelets
    inStock: true,
    featured: false
  },
  {
    name: 'Rose Gold Engagement Ring',
    description: 'Stunning rose gold engagement ring with central diamond',
    price: 999.99,
    image: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    categoryId: 2, // Will reference Rings
    inStock: true,
    featured: true
  },
  {
    name: 'Minimalist Watch',
    description: 'Elegant minimalist watch with leather strap',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    categoryId: 5, // Will reference Watches
    inStock: true,
    featured: false
  },
  {
    name: 'Pearl Stud Earrings',
    description: 'Classic pearl stud earrings with 14k gold posts',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    categoryId: 3, // Will reference Earrings
    inStock: true,
    featured: false
  }
];

async function initializeData() {
  try {
    // First, set up the database
    const dbSetup = await setupDatabase();
    if (!dbSetup.success) {
      throw new Error(`Database setup failed: ${dbSetup.error}`);
    }
    
    console.log('Syncing database models...');
    // Force true will drop tables if they exist
    await sequelize.sync({ force: true });
    console.log('Database models synchronized successfully');
    
    // Add categories
    console.log('Adding categories...');
    const createdCategories = await Category.bulkCreate(categories);
    console.log(`Added ${createdCategories.length} categories`);
    
    // Add products
    console.log('Adding products...');
    const createdProducts = await Product.bulkCreate(products);
    console.log(`Added ${createdProducts.length} products`);
    
    console.log('Database initialization completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error: error.message };
  }
}

// Run if called directly
if (require.main === module) {
  initializeData()
    .then(result => {
      if (result.success) {
        console.log('Database initialization completed successfully!');
        process.exit(0);
      } else {
        console.error('Database initialization failed:', result.error);
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Unexpected error:', err);
      process.exit(1);
    });
}

module.exports = initializeData; 