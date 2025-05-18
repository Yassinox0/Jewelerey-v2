const { sequelize } = require('../models');
const { Category, Product, User } = require('../models');
const bcrypt = require('bcryptjs');

const setupDatabase = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Disable foreign key checks temporarily
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Sync all models
    await sequelize.sync({ force: true }); // This will drop all tables and recreate them
    console.log('Database tables have been synchronized.');

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

    // Create jewelry categories
    const categories = await Promise.all([
      Category.create({
        name: 'Wedding Rings',
        slug: 'wedding-rings',
        description: 'Beautiful wedding rings for your special day'
      }),
      Category.create({
        name: 'Engagement Rings',
        slug: 'engagement-rings',
        description: 'Stunning engagement rings to pop the question'
      }),
      Category.create({
        name: 'Fashion Rings',
        slug: 'fashion-rings',
        description: 'Trendy and stylish fashion rings'
      }),
      Category.create({
        name: 'Collection 1',
        slug: 'collection-1',
        description: 'Exclusive collection of premium jewelry'
      }),
      Category.create({
        name: 'Collection 2',
        slug: 'collection-2',
        description: 'Unique designs for the modern woman'
      }),
      Category.create({
        name: 'Collection 3',
        slug: 'collection-3',
        description: 'Timeless pieces for every occasion'
      })
    ]);
    console.log('Initial categories created.');

    // Create sample products
    const products = await Promise.all([
      Product.create({
        name: 'Classic Wedding Ring',
        description: 'Elegant and timeless wedding ring with a modern twist',
        price: 1299.99,
        image: '/images/w.ring.jpg',
        category_id: categories[0].id,
        in_stock: true,
        featured: true
      }),
      Product.create({
        name: 'Diamond Wedding Ring',
        description: 'Luxurious wedding ring with diamond accents',
        price: 2499.99,
        image: '/images/w.ring1.jpg',
        category_id: categories[0].id,
        in_stock: true,
        featured: true
      }),
      Product.create({
        name: 'Vintage Wedding Ring',
        description: 'Beautiful vintage-inspired wedding ring',
        price: 1899.99,
        image: '/images/w.ring 2.jpg',
        category_id: categories[0].id,
        in_stock: true,
        featured: false
      }),
      Product.create({
        name: 'Modern Engagement Ring',
        description: 'Contemporary engagement ring with a unique design',
        price: 3499.99,
        image: '/images/w.ring 3.jpg',
        category_id: categories[1].id,
        in_stock: true,
        featured: true
      }),
      Product.create({
        name: 'Classic Engagement Ring',
        description: 'Traditional engagement ring with timeless elegance',
        price: 2999.99,
        image: '/images/w.ring 4.webp',
        category_id: categories[1].id,
        in_stock: true,
        featured: true
      }),
      Product.create({
        name: 'Fashion Statement Ring',
        description: 'Bold and stylish fashion ring for everyday wear',
        price: 499.99,
        image: '/images/w.ring 5.jpeg',
        category_id: categories[2].id,
        in_stock: true,
        featured: false
      }),
      Product.create({
        name: 'Designer Fashion Ring',
        description: 'Unique designer ring with modern aesthetics',
        price: 799.99,
        image: '/images/w.ring 6.jpeg',
        category_id: categories[2].id,
        in_stock: true,
        featured: true
      }),
      Product.create({
        name: 'Artistic Fashion Ring',
        description: 'Artistic and creative design for the fashion-forward',
        price: 599.99,
        image: '/images/w.ring 7.jpg',
        category_id: categories[2].id,
        in_stock: true,
        featured: false
      }),
      Product.create({
        name: 'Premium Collection Piece 1',
        description: 'Exclusive design from our premium collection',
        price: 1999.99,
        image: '/images/sec4-img1.jpg',
        category_id: categories[3].id,
        in_stock: true,
        featured: true
      }),
      Product.create({
        name: 'Premium Collection Piece 2',
        description: 'Luxurious design with intricate details',
        price: 2499.99,
        image: '/images/sec4-img2.jpg',
        category_id: categories[3].id,
        in_stock: true,
        featured: true
      }),
      Product.create({
        name: 'Modern Collection Piece 1',
        description: 'Contemporary design for the modern woman',
        price: 899.99,
        image: '/images/sec4-img3.jpg',
        category_id: categories[4].id,
        in_stock: true,
        featured: true
      }),
      Product.create({
        name: 'Modern Collection Piece 2',
        description: 'Stylish and elegant design',
        price: 1299.99,
        image: '/images/sec4-img4.jpg',
        category_id: categories[4].id,
        in_stock: true,
        featured: false
      }),
      Product.create({
        name: 'Timeless Collection Piece 1',
        description: 'Classic design that never goes out of style',
        price: 1599.99,
        image: '/images/sec4-img5.jpg',
        category_id: categories[5].id,
        in_stock: true,
        featured: true
      }),
      Product.create({
        name: 'Timeless Collection Piece 2',
        description: 'Elegant and sophisticated design',
        price: 1899.99,
        image: '/images/sec4-img6.jpg',
        category_id: categories[5].id,
        in_stock: true,
        featured: true
      })
    ]);
    console.log('Sample products created.');

    // Create an admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      is_active: true
    });
    console.log('Admin user created.');

    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    // Re-enable foreign key checks in case of error
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (e) {
      console.error('Error re-enabling foreign key checks:', e);
    }
    process.exit(1);
  }
};

setupDatabase(); 