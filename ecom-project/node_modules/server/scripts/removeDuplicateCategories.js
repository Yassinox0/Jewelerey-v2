const { getDB, connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// IDs of duplicate categories to remove
const categoriesToRemove = [
  '6828cbffed492c812958148f', // Duplicate Rings
  '6828cbffed492c8129581490', // Duplicate Necklaces
  '6828cbffed492c8129581491', // Duplicate Earrings
  '6828cbffed492c8129581492'  // Duplicate Bracelets
];

async function removeDuplicateCategories() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');
    
    const db = getDB();
    
    // Delete the duplicate categories
    for (const categoryId of categoriesToRemove) {
      const result = await db.collection('categories').deleteOne({ 
        _id: new ObjectId(categoryId) 
      });
      
      if (result.deletedCount === 1) {
        console.log(`Successfully deleted category with ID: ${categoryId}`);
      } else {
        console.log(`Category with ID ${categoryId} not found`);
      }
    }
    
    // Get remaining categories to verify
    const remainingCategories = await db.collection('categories').find({}).toArray();
    console.log(`Remaining categories: ${remainingCategories.length}`);
    console.log(remainingCategories.map(cat => cat.name));
    
    console.log('Finished removing duplicate categories');
    process.exit(0);
  } catch (error) {
    console.error('Error removing duplicate categories:', error);
    process.exit(1);
  }
}

// Run the function
removeDuplicateCategories(); 