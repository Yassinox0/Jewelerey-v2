const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Get all products
const getAllProducts = async () => {
  try {
    console.log('Getting all products from MongoDB...');
    const db = getDB();
    console.log('Database accessed successfully');
    const products = await db.collection('products').find().toArray();
    console.log(`Found ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw error; // Re-throw to be handled by the route
  }
};

// Get product by ID
const getProductById = async (id) => {
  const db = getDB();
  const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
  return product;
};

// Get products by category
const getProductsByCategory = async (categoryId) => {
  const db = getDB();
  const products = await db.collection('products').find({ category_id: categoryId }).toArray();
  return products;
};

// Get products by category slug
const getProductsByCategorySlug = async (slug) => {
  const db = getDB();
  
  // First, find the category by slug
  const category = await db.collection('categories').findOne({ slug: slug });
  
  if (!category) {
    return null; // Category not found
  }
  
  // Then get products with matching category_id
  const products = await db.collection('products').find({ 
    category_id: category._id 
  }).toArray();
  
  return { 
    category,
    products 
  };
};

// Create product
const createProduct = async (productData) => {
  const db = getDB();
  const result = await db.collection('products').insertOne(productData);
  return { ...productData, _id: result.insertedId };
};

// Update product
const updateProduct = async (id, productData) => {
  const db = getDB();
  await db.collection('products').updateOne(
    { _id: new ObjectId(id) },
    { $set: productData }
  );
  return getProductById(id);
};

// Delete product
const deleteProduct = async (id) => {
  const db = getDB();
  const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

// Search products
const searchProducts = async (query) => {
  const db = getDB();
  const products = await db.collection('products').find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  }).toArray();
  return products;
};

// Update images for existing products to use external URLs
const updateProductImages = async () => {
  try {
    console.log('Updating product images with real URLs...');
    const db = getDB();
    
    // Real jewelry image URLs from online sources
    const imageMap = {
      'Diamond Engagement Ring': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlhbW9uZCUyMHJpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Pearl Necklace': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlYXJsJTIwbmVja2xhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Sapphire Earrings': 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZWFycmluZ3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Gold Bracelet': 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z29sZCUyMGJyYWNlbGV0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'Rose Gold Ring': 'https://images.unsplash.com/photo-1599459182681-c938b7f65dfb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9zZSUyMGdvbGQlMjByaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'Silver Chain Necklace': 'https://images.unsplash.com/photo-1611107683227-e9060eccd846?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2lsdmVyJTIwbmVja2xhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    };
    
    // Get all products
    const products = await db.collection('products').find().toArray();
    
    // Update each product with a real image URL
    for (const product of products) {
      const imageUrl = imageMap[product.name] || 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60';
      
      await db.collection('products').updateOne(
        { _id: product._id },
        { $set: { image: imageUrl } }
      );
    }
    
    console.log('Product images updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating product images:', error);
    return false;
  }
};

// Update all product images to use local assets
const updateProductImagesWithLocalAssets = async () => {
  try {
    console.log('Updating product images with local assets...');
    const db = getDB();
    
    // Map product names to local asset files
    const imageMap = {
      'Diamond Engagement Ring': '/static/rings-standing.png',
      'Pearl Necklace': '/static/necklaces-category-1.png',
      'Sapphire Earrings': '/static/earrings-category.png',
      'Gold Bracelet': '/static/bracelets-category.png',
      'Rose Gold Ring': '/static/eternal-love-main1-768x768.png',
      'Silver Chain Necklace': '/static/pendants-category.png',
      // Add mappings for other products
      'Crystal Necklace': '/static/crystal-elegance-main1-1-650x650.png',
      'Diamond Pendant': '/static/diamond-shine-main1-768x768.png',
      'Gold Earrings': '/static/golden-curls1-450x450.png',
      'Crystal Earrings': '/static/goldplated-crystal-flower-leverback1-650x650.png',
      'Luxury Watch': '/static/jewelry-scale1.png',
      'Crystal Bracelet': '/static/crystal-harmony-main1-768x768.png',
      'Amethyst Ring': '/static/amethyst-refinement-main1-768x768.png',
      'Pearl Earrings': '/static/rhodolite-garnet-and-diamond-earrings1-768x768.png',
      'Designer Necklace': '/static/luxurious-star-main1-768x768.png',
      'Mother of Pearl Pendant': '/static/mother-of-pearl-chara-main1-650x650.png',
      'Waterfall Pendant': '/static/Sparkling-Waterfall1-768x768.png'
    };
    
    // Get all products
    const products = await db.collection('products').find().toArray();
    
    // Update each product with a local image path
    for (const product of products) {
      // Use specific image if available, or default based on category
      let imagePath;
      
      if (imageMap[product.name]) {
        imagePath = imageMap[product.name];
      } else {
        // Default fallback images by category
        switch(product.category_name) {
          case 'Rings':
            imagePath = '/static/rings-standing.png';
            break;
          case 'Necklaces':
            imagePath = '/static/necklaces-category-1.png';
            break;
          case 'Earrings':
            imagePath = '/static/earrings-category.png';
            break;
          case 'Bracelets':
            imagePath = '/static/bracelets-category.png';
            break;
          default:
            imagePath = '/static/jewelry-scale1.png';
        }
      }
      
      await db.collection('products').updateOne(
        { _id: product._id },
        { $set: { image: imagePath } }
      );
    }
    
    console.log('Product images updated with local assets successfully');
    return true;
  } catch (error) {
    console.error('Error updating product images with local assets:', error);
    return false;
  }
};

// Initialize products collection with sample data
const initializeProducts = async () => {
  const db = getDB();
  const count = await db.collection('products').countDocuments();
  
  // Only seed if no products exist
  if (count === 0) {
    console.log('Initializing products collection with sample data...');
    
    // Sample categories
    const categories = [
      { _id: new ObjectId(), name: 'Rings', slug: 'rings', description: 'Beautiful rings for every occasion' },
      { _id: new ObjectId(), name: 'Necklaces', slug: 'necklaces', description: 'Elegant necklaces for any style' },
      { _id: new ObjectId(), name: 'Earrings', slug: 'earrings', description: 'Stunning earrings to complement your look' },
      { _id: new ObjectId(), name: 'Bracelets', slug: 'bracelets', description: 'Charming bracelets for daily wear' }
    ];
    
    // Insert categories
    await db.collection('categories').insertMany(categories);
    console.log('Categories initialized');
    
    // Sample products with local image paths
    const products = [
      {
        name: 'Diamond Engagement Ring',
        description: 'Beautiful 1-carat diamond ring with white gold band',
        price: 1499.99,
        image: '/static/rings-standing.png',
        category_id: categories[0]._id,
        category_name: categories[0].name,
        in_stock: true,
        quantity: 5,
        rating: 4.7,
        review_count: 23
      },
      {
        name: 'Pearl Necklace',
        description: 'Elegant freshwater pearl necklace with sterling silver chain',
        price: 249.99,
        image: '/static/necklaces-category-1.png',
        category_id: categories[1]._id,
        category_name: categories[1].name,
        in_stock: true,
        quantity: 8,
        rating: 4.5,
        review_count: 15
      },
      {
        name: 'Sapphire Earrings',
        description: 'Beautiful sapphire stud earrings with white gold setting',
        price: 349.99,
        image: '/static/earrings-category.png',
        category_id: categories[2]._id,
        category_name: categories[2].name,
        in_stock: true,
        quantity: 10,
        rating: 4.8,
        review_count: 18
      },
      {
        name: 'Gold Bracelet',
        description: 'Stylish 18k gold bracelet with intricate design',
        price: 549.99,
        image: '/static/bracelets-category.png',
        category_id: categories[3]._id,
        category_name: categories[3].name,
        in_stock: true,
        quantity: 3,
        rating: 4.6,
        review_count: 12
      },
      {
        name: 'Rose Gold Ring',
        description: 'Elegant rose gold ring with small diamonds',
        price: 699.99,
        image: '/static/eternal-love-main1-768x768.png',
        category_id: categories[0]._id,
        category_name: categories[0].name,
        in_stock: true,
        quantity: 7,
        rating: 4.9,
        review_count: 28
      },
      {
        name: 'Silver Chain Necklace',
        description: 'Sterling silver chain necklace with pendant',
        price: 199.99,
        image: '/static/pendants-category.png',
        category_id: categories[1]._id,
        category_name: categories[1].name,
        in_stock: true,
        quantity: 15,
        rating: 4.3,
        review_count: 9
      }
    ];
    
    // Insert products
    await db.collection('products').insertMany(products);
    console.log('Products initialized');
    
    return { categories, products };
  } else {
    console.log(`Products already exist in the database (${count} found). Checking if images need updating...`);
    await updateProductImagesWithLocalAssets();
    return null;
  }
};

// Update the Rose Gold Ring image specifically
const updateRoseGoldRingImage = async () => {
  try {
    console.log('Updating Rose Gold Ring image...');
    const db = getDB();
    
    // Find the Rose Gold Ring product
    const result = await db.collection('products').updateOne(
      { name: 'Rose Gold Ring' },
      { $set: { 
        image: '/static/eternal-love-main1-768x768.png',
        description: 'Elegant rose gold ring with small diamonds set in a delicate pattern'
      }}
    );
    
    if (result.modifiedCount === 1) {
      console.log('Rose Gold Ring image updated successfully');
      return true;
    } else {
      console.log('Rose Gold Ring product not found');
      return false;
    }
  } catch (error) {
    console.error('Error updating Rose Gold Ring image:', error);
    return false;
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByCategorySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  initializeProducts,
  updateProductImages,
  updateRoseGoldRingImage,
  updateProductImagesWithLocalAssets
}; 