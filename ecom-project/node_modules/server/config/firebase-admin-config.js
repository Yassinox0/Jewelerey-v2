const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Helper function to ensure private key is properly formatted
function formatPrivateKey(privateKey) {
  if (!privateKey) return null;
  
  // If the key doesn't start with the BEGIN marker, return null
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.error('Private key is missing BEGIN marker');
    return null;
  }
  
  // If the key doesn't end with the END marker, return null
  if (!privateKey.includes('-----END PRIVATE KEY-----')) {
    console.error('Private key is missing END marker');
    return null;
  }
  
  // Ensure the key has proper line breaks
  let formattedKey = privateKey
    .replace(/\\n/g, '\n')  // Replace string \n with actual line breaks
    .replace(/-----BEGIN PRIVATE KEY-----\s+/, '-----BEGIN PRIVATE KEY-----\n')  // Ensure break after begin
    .replace(/\s+-----END PRIVATE KEY-----/, '\n-----END PRIVATE KEY-----\n');   // Ensure break before end
    
  return formattedKey;
}

const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    try {
      // Try to initialize with env var if available
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault()
        });
        console.log('Firebase Admin SDK initialized with application default credentials');
      } else {
        // Check for service account file
        const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
        
        if (fs.existsSync(serviceAccountPath)) {
          // File exists, load it
          try {
            const serviceAccountRaw = fs.readFileSync(serviceAccountPath, 'utf8');
            const serviceAccount = JSON.parse(serviceAccountRaw);
            
            // Format the private key properly
            if (serviceAccount.private_key) {
              serviceAccount.private_key = formatPrivateKey(serviceAccount.private_key);
              
              if (!serviceAccount.private_key) {
                throw new Error('Failed to format private key from service account file');
              }
              
              admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
              });
              console.log('Firebase Admin SDK initialized with service account file');
            } else {
              throw new Error('Service account file is missing the private_key field');
            }
          } catch (error) {
            console.error('Error loading service account file:', error.message);
            throw error;
          }
        } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
          // Use environment variables if available
          const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
          
          if (!privateKey) {
            throw new Error('Failed to format private key from environment variable');
          }
          
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: privateKey
            })
          });
          console.log('Firebase Admin SDK initialized with environment variables');
        } else {
          console.error('========== FIREBASE CONFIGURATION ERROR ==========');
          console.error('Firebase service account file not found at:', serviceAccountPath);
          console.error('And no environment variables are set for Firebase.');
          console.error('To fix this, either:');
          console.error('1. Create a firebase-service-account.json file in the server directory');
          console.error('2. Set the following environment variables:');
          console.error('   - FIREBASE_PROJECT_ID');
          console.error('   - FIREBASE_CLIENT_EMAIL');
          console.error('   - FIREBASE_PRIVATE_KEY');
          console.error('Login/registration will not work until this is fixed.');
          console.error('================================================');
          
          throw new Error('Firebase configuration is missing');
        }
      }
    } catch (error) {
      console.error('Firebase Admin SDK initialization error:', error);
      throw error; // Re-throw to prevent partial initialization
    }
  }
  
  return admin;
};

module.exports = {
  admin: (() => {
    try {
      return initializeFirebaseAdmin();
    } catch (error) {
      // Return null if initialization fails, application should handle this accordingly
      console.error('Returning null admin instance due to initialization failure');
      return null;
    }
  })(),
  initializeFirebaseAdmin
}; 