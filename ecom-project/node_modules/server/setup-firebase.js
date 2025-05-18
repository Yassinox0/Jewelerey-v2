/**
 * Firebase Authentication Setup Helper
 * 
 * This script helps configure Firebase authentication for the application.
 * It checks for the existence of service account files and creates a .env file
 * with Firebase environment variables.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
const templatePath = path.join(__dirname, 'firebase-service-account-template.json');
const envPath = path.join(__dirname, '.env');

console.log('=== Firebase Authentication Setup ===\n');

// Check if service account file exists
const serviceAccountExists = fs.existsSync(serviceAccountPath);

if (serviceAccountExists) {
  console.log('✅ Firebase service account file found!');
  try {
    const serviceAccount = require(serviceAccountPath);
    if (!serviceAccount.private_key || !serviceAccount.client_email || !serviceAccount.project_id) {
      console.log('⚠️  Warning: Service account file seems to be missing required fields.');
    } else {
      console.log('✅ Service account file contains required fields.');
    }
  } catch (error) {
    console.log('⚠️  Error reading service account file:', error.message);
  }
} else {
  console.log('❌ Firebase service account file not found.');
  
  // Check if template exists
  if (fs.existsSync(templatePath)) {
    console.log('\nA template file exists at: ' + templatePath);
    console.log('Please rename this file to "firebase-service-account.json" and fill in the required details.');
  } else {
    console.log('\nCreating template file...');
    try {
      fs.copyFileSync(
        path.join(__dirname, 'firebase-service-account-template.json'), 
        templatePath
      );
      console.log('✅ Template created successfully at: ' + templatePath);
      console.log('Please fill it with your Firebase service account details and rename to "firebase-service-account.json"');
    } catch (error) {
      console.log('❌ Failed to create template:', error.message);
    }
  }
}

// Check for environment variables in .env file
let envFileExists = false;
let hasFirebaseEnvVars = false;

if (fs.existsSync(envPath)) {
  envFileExists = true;
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  const hasProjectId = envContent.includes('FIREBASE_PROJECT_ID=');
  const hasClientEmail = envContent.includes('FIREBASE_CLIENT_EMAIL=');
  const hasPrivateKey = envContent.includes('FIREBASE_PRIVATE_KEY=');
  
  hasFirebaseEnvVars = hasProjectId && hasClientEmail && hasPrivateKey;
  
  if (hasFirebaseEnvVars) {
    console.log('\n✅ Firebase environment variables found in .env file.');
  } else {
    console.log('\n❌ Firebase environment variables not found or incomplete in .env file.');
  }
}

console.log('\nTo fix Firebase authentication issues:');
console.log('1. Get your Firebase service account key from Firebase Console:');
console.log('   - Go to Project Settings > Service Accounts');
console.log('   - Click "Generate New Private Key"');

console.log('\n2. Either:');
console.log('   a) Save the downloaded JSON as "firebase-service-account.json" in the server directory');
console.log('   OR');
console.log('   b) Add the following to your .env file:');
console.log('      FIREBASE_PROJECT_ID=your-project-id');
console.log('      FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project-id.iam.gserviceaccount.com');
console.log('      FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');

console.log('\nWould you like to create or update your .env file with placeholders for Firebase variables? (y/n)');

rl.question('> ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    try {
      // Read existing .env or create new
      let envContent = '';
      if (envFileExists) {
        envContent = fs.readFileSync(envPath, 'utf-8');
      }
      
      // Add Firebase variables if not present
      if (!envContent.includes('FIREBASE_PROJECT_ID=')) {
        envContent += '\nFIREBASE_PROJECT_ID=your-project-id';
      }
      if (!envContent.includes('FIREBASE_CLIENT_EMAIL=')) {
        envContent += '\nFIREBASE_CLIENT_EMAIL=your-service-account-email@your-project-id.iam.gserviceaccount.com';
      }
      if (!envContent.includes('FIREBASE_PRIVATE_KEY=')) {
        envContent += '\nFIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"';
      }
      
      // Write to .env file
      fs.writeFileSync(envPath, envContent.trim() + '\n');
      console.log('✅ .env file updated successfully with Firebase variable placeholders.');
    } catch (error) {
      console.log('❌ Failed to update .env file:', error.message);
    }
  }
  
  console.log('\nSetup complete. Restart your server after making the necessary changes.');
  rl.close();
}); 