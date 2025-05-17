const { User } = require('../models');
const sequelize = require('../config/database');

async function createAdminUser() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Create admin user
    const adminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed by the model's hooks
      role: 'admin',
      isActive: true
    };

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: adminUser.email } });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return existingAdmin;
    }

    // Create new admin user
    const newAdmin = await User.create(adminUser);
    console.log('Admin user created successfully:', {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role
    });

    return newAdmin;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('Admin user setup completed.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Admin user setup failed:', error);
      process.exit(1);
    });
}

module.exports = createAdminUser; 