const setupDatabase = require('./scripts/setup-mysql-db');
const initializeData = require('./scripts/init-mysql-data');

async function main() {
  console.log('=== MySQL Database Setup ===');
  
  try {
    // Step 1: Set up the database
    console.log('\n--- Step 1: Setting up database ---');
    const dbSetup = await setupDatabase();
    if (!dbSetup.success) {
      throw new Error(`Database setup failed: ${dbSetup.error}`);
    }
    
    // Step 2: Initialize data
    console.log('\n--- Step 2: Initializing data ---');
    const dataInit = await initializeData();
    if (!dataInit.success) {
      throw new Error(`Data initialization failed: ${dataInit.error}`);
    }
    
    console.log('\n=== MySQL Database Setup Completed Successfully ===');
    console.log(`
Database Information:
--------------------
Host: ${dbSetup.host}
Port: ${dbSetup.port}
Database Name: ${dbSetup.dbName}
User: ${dbSetup.user}
    `);
    
  } catch (error) {
    console.error('\n=== MySQL Database Setup Failed ===');
    console.error(error);
    process.exit(1);
  }
}

// Run the setup
main(); 