const { getDB, connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs').promises;

/**
 * Script to create products in MongoDB based on image files
 */
const createProductsFromImages = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    const db = getDB();
    
    // Define categories with the existing IDs and data
    const categories = [
      { _id: new ObjectId("6828b95e3c818ef6feae63b9"), name: 'Rings', slug: 'rings', description: 'Beautiful rings for every occasion' },
      { _id: new ObjectId("6828b95e3c818ef6feae63ba"), name: 'Necklaces', slug: 'necklaces', description: 'Elegant necklaces for any style' },
      { _id: new ObjectId("6828b95e3c818ef6feae63bb"), name: 'Earrings', slug: 'earrings', description: 'Stunning earrings to complement your look' },
      { _id: new ObjectId("6828b95e3c818ef6feae63bc"), name: 'Bracelets', slug: 'bracelets', description: 'Charming bracelets for daily wear' }
    ];
    
    // Product data mapper
    const productNameMap = {
      // Rings
      '1': { name: 'Diamond Engagement Ring', category: 'Rings', price: 1599.99 },
      '2': { name: 'Rose Gold Ring', category: 'Rings', price: 799.99 },
      'eternal-love-main1': { name: 'Eternal Love Ring', category: 'Rings', price: 999.99 },
      'luxurious-star-main1': { name: 'Luxurious Star Ring', category: 'Rings', price: 1299.99 },
      'rings-standing': { name: 'Standing Diamond Ring', category: 'Rings', price: 1499.99 },
      
      // Necklaces
      '5': { name: 'Silver Chain Necklace', category: 'Necklaces', price: 299.99 },
      '6': { name: 'Pearl Pendant Necklace', category: 'Necklaces', price: 349.99 },
      '7': { name: 'Gold Locket Necklace', category: 'Necklaces', price: 479.99 },
      'pendants-category': { name: 'Crystal Pendant', category: 'Necklaces', price: 399.99 },
      'necklaces-category-1': { name: 'Gold Link Chain', category: 'Necklaces', price: 599.99 },
      
      // Earrings
      '8': { name: 'Sapphire Earrings', category: 'Earrings', price: 459.99 },
      '9': { name: 'Diamond Stud Earrings', category: 'Earrings', price: 799.99 },
      '10': { name: 'Gold Hoop Earrings', category: 'Earrings', price: 349.99 },
      'earrings-category': { name: 'Pearl Drop Earrings', category: 'Earrings', price: 299.99 },
      'rhodolite-garnet-and-diamond-earrings1': { name: 'Rhodolite Garnet Earrings', category: 'Earrings', price: 599.99 },
      'goldplated-crystal-flower-leverback1': { name: 'Crystal Flower Earrings', category: 'Earrings', price: 249.99 },
      
      // Bracelets
      '12': { name: 'Gold Bracelet', category: 'Bracelets', price: 649.99 },
      '13': { name: 'Silver Charm Bracelet', category: 'Bracelets', price: 299.99 },
      '15': { name: 'Tennis Bracelet', category: 'Bracelets', price: 899.99 },
      'bracelets-category': { name: 'Diamond Tennis Bracelet', category: 'Bracelets', price: 1299.99 },
      'crystal-harmony-main1': { name: 'Crystal Harmony Bracelet', category: 'Bracelets', price: 499.99 },

      // Others (will use default if not in the list)
      '3': { name: 'Gemstone Pendant', category: 'Necklaces', price: 379.99 },
      '17': { name: 'Statement Ring', category: 'Rings', price: 899.99 },
      '19': { name: 'Diamond Bracelet', category: 'Bracelets', price: 1199.99 },
      'crystal-elegance-main1-1': { name: 'Crystal Elegance Set', category: 'Necklaces', price: 599.99 },
      'diamond-shine-main1': { name: 'Diamond Shine Earrings', category: 'Earrings', price: 699.99 },
      'mother-of-pearl-chara-main1': { name: 'Mother of Pearl Charm', category: 'Necklaces', price: 399.99 },
      'amethyst-refinement-main1': { name: 'Amethyst Refinement Ring', category: 'Rings', price: 799.99 },
      'Sparkling-Waterfall1': { name: 'Sparkling Waterfall Necklace', category: 'Necklaces', price: 899.99 },
      'golden-curls1': { name: 'Golden Curls Earrings', category: 'Earrings', price: 349.99 }
    };
    
    // Create products array
    const products = [];
    const productsFolder = '../../client/src/assets/products images';
    
    // Read products folder
    console.log('Reading product images directory...');
    const files = await fs.readdir(path.resolve(__dirname, productsFolder));
    
    // Filter for relevant PNG images (only main product images, not thumbnails)
    const productImages = files.filter(file => {
      return file.endsWith('.png') && 
             !file.includes('-300x') && 
             !file.includes('-768x') && 
             !file.includes('-scaled') &&
             !file.includes('-291x');
    });
    
    console.log(`Found ${productImages.length} product images`);
    
    // Create product objects
    for (const image of productImages) {
      // Extract base name without extension
      const baseName = path.basename(image, '.png');
      
      // Get product info from map or create default
      let productInfo = productNameMap[baseName] || {
        name: `Jewelry Item ${baseName}`,
        category: 'Rings',
        price: 499.99
      };
      
      // Find category by name
      const category = categories.find(cat => cat.name === productInfo.category);
      if (!category) continue;
      
      // Create the product object
      const product = {
        name: productInfo.name,
        description: `Beautiful ${productInfo.category.toLowerCase()} piece with high-quality craftsmanship.`,
        price: productInfo.price,
        image: `/assets/products images/${image}`, // Path relative to client src
        category_id: category._id,
        category_name: category.name,
        in_stock: true,
        quantity: Math.floor(Math.random() * 10) + 5, // Random stock between 5-15
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Random rating between 3.5-5.0
        review_count: Math.floor(Math.random() * 30) + 5 // Random review count between 5-35
      };
      
      products.push(product);
    }
    
    // Insert products into MongoDB
    console.log(`Adding ${products.length} products to MongoDB...`);
    const result = await db.collection('products').insertMany(products);
    
    console.log(`Successfully added ${result.insertedCount} products to the database.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the function
createProductsFromImages(); 