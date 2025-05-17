// Get MongoDB connection
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

/**
 * Create or update a user profile in MongoDB after Firebase authentication
 * @route POST /api/users/create-profile
 * @access Private
 */
exports.createProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { uid } = req.user;

    if (!uid || !email) {
      return res.status(400).json({
        success: false,
        error: 'User ID and email are required'
      });
    }

    const db = getDB();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ firebaseUid: uid });
    
    if (existingUser) {
      // Update existing user
      await usersCollection.updateOne(
        { firebaseUid: uid },
        { 
          $set: { 
            name: name || existingUser.name,
            email,
            updatedAt: new Date()
          } 
        }
      );

      return res.status(200).json({
        success: true,
        message: 'User profile updated'
      });
    }

    // Create new user profile
    const newUser = {
      firebaseUid: uid,
      name,
      email,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: 'User profile created'
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/users/me
 * @access Private
 */
exports.getProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const db = getDB();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ firebaseUid: uid }, {
      projection: { password: 0 } // Exclude password
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 