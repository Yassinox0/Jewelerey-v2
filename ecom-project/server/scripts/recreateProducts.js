const { getDB, connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs').promises;

/**
 * Script to recreate products in MongoDB based on available image files
 */
const recreateProducts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    const db = getDB();
    
    // 1. Clear existing products
    console.log('Deleting all existing products...');
    const deleteResult = await db.collection('products').deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing products`);
    
    // 2. Define categories with the existing IDs
    const categories = [
      { _id: new ObjectId("6828b95e3c818ef6feae63b9"), name: 'Rings', slug: 'rings', description: 'Beautiful rings for every occasion' },
      { _id: new ObjectId("6828b95e3c818ef6feae63ba"), name: 'Necklaces', slug: 'necklaces', description: 'Elegant necklaces for any style' },
      { _id: new ObjectId("6828b95e3c818ef6feae63bb"), name: 'Earrings', slug: 'earrings', description: 'Stunning earrings to complement your look' },
      { _id: new ObjectId("6828b95e3c818ef6feae63bc"), name: 'Bracelets', slug: 'bracelets', description: 'Charming bracelets for daily wear' }
    ];
    
    // 3. Map for product data based on image filenames
    const productData = {
      // Rings
      '1': { name: 'Diamond Engagement Ring', category: 'Rings', price: 1599.99, featured: true },
      '2': { name: 'Rose Gold Ring', category: 'Rings', price: 799.99 },
      '17': { name: 'Statement Ring', category: 'Rings', price: 899.99 },
      'eternal-love-main1': { name: 'Eternal Love Ring', category: 'Rings', price: 999.99 },
      'luxurious-star-main1': { name: 'Luxurious Star Ring', category: 'Rings', price: 1299.99 },
      'rings-standing': { name: 'Standing Diamond Ring', category: 'Rings', price: 1499.99 },
      'amethyst-refinement-main1': { name: 'Amethyst Refinement Ring', category: 'Rings', price: 799.99, featured: true },
      
      // Necklaces
      '3': { name: 'Gemstone Pendant', category: 'Necklaces', price: 379.99 },
      '5': { name: 'Silver Chain Necklace', category: 'Necklaces', price: 299.99 },
      '6': { name: 'Pearl Pendant Necklace', category: 'Necklaces', price: 349.99, featured: true },
      '7': { name: 'Gold Locket Necklace', category: 'Necklaces', price: 479.99 },
      'pendants-category': { name: 'Crystal Pendant', category: 'Necklaces', price: 399.99 },
      'necklaces-category-1': { name: 'Gold Link Chain', category: 'Necklaces', price: 599.99 },
      'crystal-elegance-main1-1': { name: 'Crystal Elegance Set', category: 'Necklaces', price: 599.99 },
      'mother-of-pearl-chara-main1': { name: 'Mother of Pearl Charm', category: 'Necklaces', price: 399.99 },
      'Sparkling-Waterfall1': { name: 'Sparkling Waterfall Necklace', category: 'Necklaces', price: 899.99, featured: true },
      
      // Earrings
      '8': { name: 'Sapphire Earrings', category: 'Earrings', price: 459.99, featured: true },
      '9': { name: 'Diamond Stud Earrings', category: 'Earrings', price: 799.99 },
      '10': { name: 'Gold Hoop Earrings', category: 'Earrings', price: 349.99 },
      'earrings-category': { name: 'Pearl Drop Earrings', category: 'Earrings', price: 299.99 },
      'rhodolite-garnet-and-diamond-earrings1': { name: 'Rhodolite Garnet Earrings', category: 'Earrings', price: 599.99, featured: true },
      'goldplated-crystal-flower-leverback1': { name: 'Crystal Flower Earrings', category: 'Earrings', price: 249.99 },
      'golden-curls1': { name: 'Golden Curls Earrings', category: 'Earrings', price: 349.99 },
      'diamond-shine-main1': { name: 'Diamond Shine Earrings', category: 'Earrings', price: 699.99 },
      
      // Bracelets
      '12': { name: 'Gold Bracelet', category: 'Bracelets', price: 649.99, featured: true },
      '13': { name: 'Silver Charm Bracelet', category: 'Bracelets', price: 299.99 },
      '15': { name: 'Tennis Bracelet', category: 'Bracelets', price: 899.99 },
      '19': { name: 'Diamond Bracelet', category: 'Bracelets', price: 1199.99 },
      'bracelets-category': { name: 'Diamond Tennis Bracelet', category: 'Bracelets', price: 1299.99, featured: true },
      'crystal-harmony-main1': { name: 'Crystal Harmony Bracelet', category: 'Bracelets', price: 499.99 },
      
      // Generic
      'slider-list-img-new-2': { name: 'Emerald Bracelet', category: 'Bracelets', price: 599.99 },
      'slider-list-img-new-5': { name: 'Silver Drop Earrings', category: 'Earrings', price: 279.99 },
      'slider-list-img-new-6': { name: 'Gold Promise Ring', category: 'Rings', price: 459.99 },
      'slider-list-img-new-7': { name: 'Diamond Pendant', category: 'Necklaces', price: 699.99 },
      'slider-list-img-new-9': { name: 'Ruby Earrings', category: 'Earrings', price: 559.99 },
      'slider-list-img-new-10': { name: 'Platinum Wedding Band', category: 'Rings', price: 999.99 },
      'h1-cat-product-image-2': { name: 'Gold Chain Bracelet', category: 'Bracelets', price: 349.99 }
    };

    // 4. Read assets directory for images
    const assetsFolder = '../../client/src/assets';
    console.log('Reading assets folder...');
    
    const files = await fs.readdir(path.resolve(__dirname, assetsFolder));
    
    // 5. Filter for usable product images (.png files that aren't thumbnails or other UI elements)
    const productImages = files.filter(file => {
      return file.endsWith('.png') && 
             !file.includes('carousel') &&
             !file.includes('ring-sec1') && 
             !file.includes('nav-top') &&
             !file.includes('-768x') &&
             !file.includes('-650x') &&
             !file.includes('-450x') &&
             !file.includes('-400x') &&
             !file.includes('-300x') &&
             !file.includes('-291x') &&
             !file.includes('-scaled');
    });
    
    console.log(`Found ${productImages.length} product images`);
    
    // 6. Create product objects for MongoDB
    const products = [];
    
    for (const image of productImages) {
      // Extract base filename without extension
      const baseName = path.basename(image, '.png');
      
      // Skip if we don't have product data for this image
      if (!productData[baseName]) {
        console.log(`No product data for image: ${baseName}.png - skipping`);
        continue;
      }
      
      const info = productData[baseName];
      const category = categories.find(cat => cat.name === info.category);
      
      if (!category) {
        console.log(`Category not found for product: ${info.name}`);
        continue;
      }
      
      // Create product object
      const product = {
        name: info.name,
        description: `Beautiful ${info.category.toLowerCase()} piece with exquisite craftsmanship and elegant design.`,
        price: info.price,
        image: `/assets/${image}`,
        category_id: category._id,
        category_name: category.name,
        in_stock: true,
        quantity: Math.floor(Math.random() * 15) + 5, // 5-20 items in stock
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0 rating
        review_count: Math.floor(Math.random() * 40) + 5, // 5-45 reviews
        featured: info.featured || false
      };
      
      products.push(product);
      console.log(`Created product: ${product.name} (${baseName}.png)`);
    }
    
    // 7. Insert products into MongoDB
    if (products.length > 0) {
      console.log(`Inserting ${products.length} products into MongoDB...`);
      const insertResult = await db.collection('products').insertMany(products);
      console.log(`Successfully inserted ${insertResult.insertedCount} products`);
    } else {
      console.log('No products to insert');
    }
    
    console.log('Product recreation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error recreating products:', error);
    process.exit(1);
  }
};

// Run the function
recreateProducts(); 