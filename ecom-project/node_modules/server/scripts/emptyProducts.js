const { getDB, connectDB } = require('../config/db');

/**
 * Script to empty all products from the MongoDB database
 */
const emptyProducts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    const db = getDB();
    
    console.log('Deleting all products from database...');
    const result = await db.collection('products').deleteMany({});
    
    console.log(`Successfully deleted ${result.deletedCount} products from the database.`);
    console.log('You can now add your products manually.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the function
emptyProducts(); 