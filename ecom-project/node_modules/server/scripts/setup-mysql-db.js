const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('Setting up MySQL database...');
  
  // Create connection without database selected
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
  });
  
  try {
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'goyna_db';
    console.log(`Creating database: ${dbName}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database ${dbName} created or already exists`);
    
    // Use the database
    await connection.query(`USE ${dbName}`);
    console.log(`Using database: ${dbName}`);
    
    console.log('Database setup completed successfully!');
    console.log(`
Database Information:
--------------------
Host: ${process.env.DB_HOST || 'localhost'}
Port: ${process.env.DB_PORT || 3306}
Database Name: ${dbName}
User: ${process.env.DB_USER || 'root'}
    `);
    
    return {
      success: true,
      dbName,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root'
    };
  } catch (error) {
    console.error('Error setting up database:', error);
    return { success: false, error: error.message };
  } finally {
    await connection.end();
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then(result => {
      if (result.success) {
        console.log('Database setup completed successfully!');
      } else {
        console.error('Database setup failed:', result.error);
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Unexpected error:', err);
      process.exit(1);
    });
}

module.exports = setupDatabase; 