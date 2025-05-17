const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = "mongodb+srv://yassinezwine25:oUy3uJY6yLwlExOP@cluster0.bwnaong.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with updated options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add these options to fix SSL connection issues
  minPoolSize: 1,
  tlsInsecure: true,  // Only use in development environment
  ssl: true,
  directConnection: false,
});

let db;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection established successfully");
    
    db = client.db('ecommerce'); // Use a database named 'ecommerce'
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Don't exit process on connection error - allow retry
    throw err;
  }
};

// Get DB instance
const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

// Close connection
const closeDB = async () => {
  await client.close();
  console.log("MongoDB connection closed");
};

module.exports = { connectDB, getDB, closeDB }; 