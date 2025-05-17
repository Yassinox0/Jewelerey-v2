require('dotenv').config();
const sequelize = require('../config/database');
const User = require('../models/User');
const Cart = require('../models/Cart');
const bcrypt = require('bcrypt');

// Admin user details
const adminUser = {
  name: 'Admin User',
  email: 'admin@goyna.com',
  password: 'admin123',
  role: 'admin'
};

// Function to create admin user
async function createAdminUser() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: adminUser.email } });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      await sequelize.close();
      return;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    const newAdmin = await User.create({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role
    });

    // Create an empty cart for the admin
    await Cart.create({
      userId: newAdmin.id
    });

    console.log('Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    console.log('Role:', adminUser.role);

    await sequelize.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function
createAdminUser(); 