const admin = require('firebase-admin');
const path = require('path');

const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    try {
      // Try to initialize with env var if available
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault()
        });
      } else {
        // Otherwise look for service account file
        try {
          const serviceAccount = require('../firebase-service-account.json');
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
        } catch (error) {
          console.error('Firebase service account file not found! Please create firebase-service-account.json in the server root');
          console.error('Login/registration will not work until Firebase admin is configured correctly');
          
          // Initialize with a placeholder for development
          // THIS SHOULD BE REMOVED IN PRODUCTION
          admin.initializeApp({
            projectId: 'goyna-jewelry',
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID || 'placeholder-project',
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'placeholder@example.com',
              privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
            })
          });
        }
      }
      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Firebase Admin SDK initialization error:', error);
    }
  }
  
  return admin;
};

module.exports = {
  admin: initializeFirebaseAdmin(),
  initializeFirebaseAdmin
}; 