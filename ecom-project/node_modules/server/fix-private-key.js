/**
 * Fix Firebase Service Account Private Key Format
 * 
 * This script automatically fixes formatting issues with the private key
 * in the Firebase service account JSON file.
 */

const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

// Check if service account file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Firebase service account file not found at:', serviceAccountPath);
  process.exit(1);
}

console.log('Reading service account file...');

try {
  // Read the service account file
  const serviceAccountRaw = fs.readFileSync(serviceAccountPath, 'utf8');
  const serviceAccount = JSON.parse(serviceAccountRaw);
  
  if (!serviceAccount.private_key) {
    console.error('Service account file is missing the private_key field');
    process.exit(1);
  }
  
  console.log('Current private key format:', serviceAccount.private_key.substring(0, 40) + '...');
  
  // Fix private key format
  let fixedKey = serviceAccount.private_key
    // Replace string \n with actual newlines if they exist
    .replace(/\\n/g, '\n')
    // Ensure there's a newline after BEGIN marker
    .replace(/-----BEGIN PRIVATE KEY-----\s+/, '-----BEGIN PRIVATE KEY-----\n')
    // Ensure there's a newline before END marker
    .replace(/\s+-----END PRIVATE KEY-----/, '\n-----END PRIVATE KEY-----')
    // Ensure there's a newline after END marker
    .replace(/-----END PRIVATE KEY-----$/, '-----END PRIVATE KEY-----\n');
  
  // Update the object with the fixed key
  serviceAccount.private_key = fixedKey;
  
  // Write the fixed file
  fs.writeFileSync(
    serviceAccountPath, 
    JSON.stringify(serviceAccount, null, 2),
    'utf8'
  );
  
  console.log('Private key format has been fixed successfully!');
  console.log('Updated private key format:', serviceAccount.private_key.substring(0, 40) + '...');
  
} catch (error) {
  console.error('Error processing service account file:', error.message);
  process.exit(1);
}

// Also create an environment file with the credentials
try {
  const serviceAccountRaw = fs.readFileSync(serviceAccountPath, 'utf8');
  const serviceAccount = JSON.parse(serviceAccountRaw);
  
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  // Read existing .env if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Add or update Firebase variables
  const envLines = envContent.split('\n');
  const newEnvLines = [];
  let hasProjectId = false;
  let hasClientEmail = false;
  let hasPrivateKey = false;
  
  // Process existing lines
  for (const line of envLines) {
    if (line.startsWith('FIREBASE_PROJECT_ID=')) {
      newEnvLines.push(`FIREBASE_PROJECT_ID=${serviceAccount.project_id}`);
      hasProjectId = true;
    } else if (line.startsWith('FIREBASE_CLIENT_EMAIL=')) {
      newEnvLines.push(`FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}`);
      hasClientEmail = true;
    } else if (line.startsWith('FIREBASE_PRIVATE_KEY=')) {
      // Format private key for .env file (double escape \n)
      const privateKeyForEnv = serviceAccount.private_key.replace(/\n/g, '\\n');
      newEnvLines.push(`FIREBASE_PRIVATE_KEY="${privateKeyForEnv}"`);
      hasPrivateKey = true;
    } else if (line.trim()) {
      newEnvLines.push(line);
    }
  }
  
  // Add missing variables
  if (!hasProjectId) {
    newEnvLines.push(`FIREBASE_PROJECT_ID=${serviceAccount.project_id}`);
  }
  if (!hasClientEmail) {
    newEnvLines.push(`FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}`);
  }
  if (!hasPrivateKey) {
    // Format private key for .env file (double escape \n)
    const privateKeyForEnv = serviceAccount.private_key.replace(/\n/g, '\\n');
    newEnvLines.push(`FIREBASE_PRIVATE_KEY="${privateKeyForEnv}"`);
  }
  
  // Write the updated .env file
  fs.writeFileSync(envPath, newEnvLines.join('\n') + '\n', 'utf8');
  
  console.log('Created/updated .env file with Firebase credentials');
  
} catch (error) {
  console.error('Error creating .env file:', error.message);
} 