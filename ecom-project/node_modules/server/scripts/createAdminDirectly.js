/**
 * Script to create an admin user directly in MongoDB
 * Usage: node createAdminDirectly.js <firebaseUid> <name>
 * 
 * This script will create or update a user in MongoDB with the admin role.
 * Note: The user will still need to register through the normal registration process,
 * but they will have admin privileges once they do.
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB Connection URI - using the same connection string as the main app
const uri = "mongodb+srv://yassinezwine25:oUy3uJY6yLwlExOP@cluster0.bwnaong.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function createAdminDirectly(firebaseUid, name) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true, // For development only
    tlsAllowInvalidHostnames: true, // For development only
    maxPoolSize: 50,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('ecommerce');
    const usersCollection = db.collection('users');
    
    // Check if user exists by firebaseUid
    const user = await usersCollection.findOne({ firebaseUid });
    
    if (user) {
      console.log('Found user:', user);
      
      // Update existing user to admin
      const result = await usersCollection.updateOne(
        { _id: user._id },
        { 
          $set: { 
            role: 'admin',
            name: name || user.name,
            updatedAt: new Date()
          } 
        }
      );
      
      if (result.modifiedCount === 1) {
        console.log(`✅ User with Firebase UID ${firebaseUid} has been updated with admin role.`);
      } else if (result.matchedCount === 1 && result.modifiedCount === 0) {
        console.log(`ℹ️ User with Firebase UID ${firebaseUid} may already have admin role or no changes were needed.`);
      } else {
        console.log(`⚠️ No changes were made to user with Firebase UID ${firebaseUid}.`);
      }
    } else {
      // Create new user in MongoDB with admin role
      const newAdminUser = {
        firebaseUid,
        name,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await usersCollection.insertOne(newAdminUser);
      console.log(`✅ New admin user created in MongoDB with Firebase UID: ${firebaseUid}`);
    }
    
    // Double-check that the update was successful
    const updatedUser = await usersCollection.findOne({ firebaseUid });
    
    console.log('\n🎉 ADMIN USER INFORMATION 🎉');
    console.log('===============================');
    console.log(`Firebase UID: ${firebaseUid}`);
    console.log(`Name: ${name}`);
    console.log(`Current Role: ${updatedUser ? updatedUser.role : 'unknown'}`);
    console.log('===============================');
    console.log('NOTE: If the role is not "admin", there might be an issue with the MongoDB schema or permissions.');
    
  } catch (error) {
    console.error('❌ Error creating/updating admin user:', error);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Get command line arguments
const firebaseUid = process.argv[2];
const name = process.argv[3] || "Yahia Admin";

if (!firebaseUid) {
  console.error('❌ Error: Firebase UID is required');
  console.log('Usage: node createAdminDirectly.js <firebaseUid> [name]');
  process.exit(1);
}

console.log(`Creating/updating admin user with:`);
console.log(`- Firebase UID: ${firebaseUid}`);
console.log(`- Name: ${name}`);
console.log('----------------------------------\n');

createAdminDirectly(firebaseUid, name); 