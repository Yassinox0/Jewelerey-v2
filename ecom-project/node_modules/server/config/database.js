const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'goyna_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: (msg) => console.log(`[Database] ${msg}`),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    },
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Log database configuration
    console.log('Database Configuration:', {
      database: process.env.DB_NAME || 'goyna_db',
      user: process.env.DB_USER || 'root',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306
    });
    
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    return false;
  }
};

// Export the sequelize instance
module.exports = sequelize;
module.exports.testConnection = testConnection; 