/**
 * Script to create or update a user as an admin in the MongoDB database
 * Usage: node createAdmin.js <email> <name>
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

// MongoDB Connection URI
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/eleganceJewelsDB';

async function createOrUpdateAdmin(email, name) {
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if user exists
    const user = await usersCollection.findOne({ email });
    
    if (user) {
      // Update existing user to admin
      const result = await usersCollection.updateOne(
        { email },
        { 
          $set: { 
            role: 'admin',
            name: name || user.name,
            updatedAt: new Date()
          } 
        }
      );
      
      if (result.modifiedCount === 1) {
        console.log(`✅ User ${email} has been successfully made an admin!`);
      } else if (result.matchedCount === 1 && result.modifiedCount === 0) {
        console.log(`ℹ️ User ${email} is already an admin.`);
      } else {
        console.log(`⚠️ No changes were made to user ${email}.`);
      }
    } else {
      // Create a new admin user
      const newAdminUser = {
        email,
        name: name || 'Admin User',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await usersCollection.insertOne(newAdminUser);
      console.log(`✅ New admin user created with email: ${email}`);
    }
  } catch (error) {
    console.error('Error creating/updating admin:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Get arguments from command line
const email = process.argv[2] || "admin@example.com";
const name = process.argv[3] || "Admin User";

console.log(`Creating/updating admin user with email: ${email}, name: ${name}`);
createOrUpdateAdmin(email, name); 