const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// MySQL connection with Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecom_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize; 