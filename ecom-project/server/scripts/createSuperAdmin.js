/**
 * Script to create a super admin user in both Firebase and MongoDB
 * Usage: node createSuperAdmin.js <email> <password> <name>
 * 
 * This script will:
 * 1. Create a user in Firebase (or use existing one)
 * 2. Create/update user in MongoDB with admin role
 */

const { MongoClient } = require('mongodb');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Initialize Firebase Admin
const serviceAccount = require('../config/firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// MongoDB Connection URI
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/eleganceJewelsDB';

async function createSuperAdmin(email, password, name) {
  const mongoClient = new MongoClient(uri);
  
  try {
    console.log('Starting admin user creation process...');
    
    // Step 1: Create or get Firebase user
    let firebaseUser;
    try {
      // Check if user exists in Firebase
      firebaseUser = await admin.auth().getUserByEmail(email);
      console.log('✅ Firebase user already exists. Using existing user.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user in Firebase
        firebaseUser = await admin.auth().createUser({
          email,
          password,
          displayName: name,
        });
        console.log('✅ Firebase user created successfully.');
      } else {
        throw error;
      }
    }
    
    // Step 2: Set custom claims for admin role in Firebase
    await admin.auth().setCustomUserClaims(firebaseUser.uid, { role: 'admin' });
    console.log('✅ Firebase user given admin role via custom claims.');
    
    // Step 3: Connect to MongoDB
    await mongoClient.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = mongoClient.db();
    const usersCollection = db.collection('users');
    
    // Step 4: Check if user exists in MongoDB
    const user = await usersCollection.findOne({ email });
    
    if (user) {
      // Update existing user
      const result = await usersCollection.updateOne(
        { email },
        { 
          $set: { 
            firebaseUid: firebaseUser.uid,
            name: name || user.name,
            role: 'admin',
            updatedAt: new Date()
          } 
        }
      );
      
      if (result.modifiedCount >= 1) {
        console.log(`✅ MongoDB user ${email} has been updated with admin role.`);
      } else {
        console.log(`ℹ️ MongoDB user ${email} already has admin role.`);
      }
    } else {
      // Create new user in MongoDB
      const newAdminUser = {
        firebaseUid: firebaseUser.uid,
        email,
        name: name,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await usersCollection.insertOne(newAdminUser);
      console.log(`✅ New admin user created in MongoDB with email: ${email}`);
    }
    
    console.log('\n🎉 SUPER ADMIN CREATION COMPLETE 🎉');
    console.log('===============================');
    console.log(`Email: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Role: admin`);
    console.log('===============================');
    console.log('You can now login with these credentials in the application.');
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  } finally {
    await mongoClient.close();
    console.log('✅ Disconnected from MongoDB');
    process.exit();
  }
}

// Get command line arguments
const email = process.argv[2] || "admin@example.com";
const password = process.argv[3] || "Admin123!"; // Strong default password
const name = process.argv[4] || "Admin User";

// Validate email
if (!email.includes('@')) {
  console.error('❌ Please provide a valid email address');
  console.log('Usage: node createSuperAdmin.js <email> <password> <name>');
  process.exit(1);
}

// Validate password
if (password.length < 6) {
  console.error('❌ Password must be at least 6 characters');
  process.exit(1);
}

console.log(`Creating super admin with:`);
console.log(`- Email: ${email}`);
console.log(`- Name: ${name}`);
console.log('----------------------------------\n');

createSuperAdmin(email, password, name); 