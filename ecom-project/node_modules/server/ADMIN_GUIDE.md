# Goyna Admin Panel Guide

This guide explains how to set up your first admin user and access the admin panel.

## Creating Your First Admin User

There are two ways to create an admin user:

### Option 1: Using Firebase Console Directly

1. Go to the Firebase console: https://console.firebase.google.com/project/ecom-4973c
2. Navigate to Authentication > Users
3. Click "Add User" and create a new user with your email and password
4. Use this email to log in to your application through the normal login page
5. After logging in, you'll need to make yourself an admin using one of these methods:
   - Use the server endpoint `/api/auth/create-admin` with a POST request containing:
     ```json
     {
       "email": "youremail@example.com",
       "password": "yourpassword",
       "name": "Admin Name",
       "secretKey": "goyna-admin-secret"
     }
     ```
   - Or modify your user document in Firestore to have `role: "admin"`

### Option 2: Using the API Endpoint

Send a POST request to: `http://localhost:5000/api/create-first-admin` with this body:

```json
{
  "name": "Admin User",
  "email": "your-email@example.com",
  "password": "your-password",
  "secretKey": "goyna-admin-secret"
}
```

This will provide instructions for creating your admin user using the Firebase console.

## Accessing the Admin Panel

1. After creating your admin user, log in to the application using your admin email and password
2. Navigate to the admin dashboard at: `http://localhost:3000/admin`

## Admin Panel Features

The admin panel provides the following features:

1. **Products Management**
   - Add new products
   - Edit existing products
   - Delete products

2. **Users Management**
   - View all users
   - Delete users

3. **Admin Settings**
   - Create additional admin users
   - View admin instructions

4. **Dashboard Stats**
   - View store statistics (coming soon)

## Setting Up Firebase Admin SDK (For Developers)

If you need full functionality on the server side with Firebase Admin SDK:

1. Go to the Firebase console: https://console.firebase.google.com/project/ecom-4973c
2. Navigate to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Download the JSON file
5. Add the file to your server (keep it private and never commit it to version control)
6. Update your `.env` file with the following:

```
FIREBASE_PROJECT_ID=ecom-4973c
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@ecom-4973c.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key\n-----END PRIVATE KEY-----\n"
```

Or modify the `firebase.js` file to use the service account file directly:

```javascript
admin.initializeApp({
  credential: admin.credential.cert(require('./path-to-serviceAccountKey.json'))
});
``` 