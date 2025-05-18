const { getDB, connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');

/**
 * Script to update categories with proper image paths
 */
const addCategoryImages = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    const db = getDB();
    
    // Define categories with their image paths
    const categories = [
      { 
        _id: new ObjectId("6828b95e3c818ef6feae63b9"), 
        name: 'Rings', 
        slug: 'rings', 
        description: 'Beautiful rings for every occasion',
        image: '/assets/rings-standing.png'
      },
      { 
        _id: new ObjectId("6828b95e3c818ef6feae63ba"), 
        name: 'Necklaces', 
        slug: 'necklaces', 
        description: 'Elegant necklaces for any style',
        image: '/assets/necklaces-category-1.png'
      },
      { 
        _id: new ObjectId("6828b95e3c818ef6feae63bb"), 
        name: 'Earrings', 
        slug: 'earrings', 
        description: 'Stunning earrings to complement your look',
        image: '/assets/earrings-category.png'
      },
      { 
        _id: new ObjectId("6828b95e3c818ef6feae63bc"), 
        name: 'Bracelets', 
        slug: 'bracelets', 
        description: 'Charming bracelets for daily wear',
        image: '/assets/bracelets-category.png'
      }
    ];
    
    console.log('Updating categories with proper image paths...');
    
    // Update each category
    for (const category of categories) {
      await db.collection('categories').updateOne(
        { _id: category._id },
        { 
          $set: { 
            image: category.image
          }
        }
      );
      console.log(`Updated category: ${category.name} with image: ${category.image}`);
    }
    
    console.log('Category images updated successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating category images:', error);
    process.exit(1);
  }
};

// Run the function
addCategoryImages(); 