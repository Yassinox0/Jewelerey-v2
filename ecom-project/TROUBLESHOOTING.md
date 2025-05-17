# Troubleshooting Guide

This document covers common issues and their solutions for the Goyna Jewelry e-commerce project.

## Firebase Authentication Issues

If you're experiencing login/registration issues with the error:
```
Service account object must contain a string "private_key" property
```
or
```
Failed to parse private key: Error: Invalid PEM formatted message.
```

Follow these steps to fix it:

### Option 1: Use the Private Key Fix Script (Recommended)

We've created a helper script to automatically fix private key format issues:

```bash
# Navigate to the server directory
cd server

# Run the fix script
node fix-private-key.js
```

This script will:
1. Fix the format of the private key in your service account file
2. Create a properly formatted .env file with the credentials

### Option 2: Set up Firebase Service Account JSON Manually

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the downloaded JSON file as `firebase-service-account.json` in the `server` directory

### Option 3: Configure Environment Variables

1. Create or edit the `.env` file in the `server` directory
2. Add the following variables:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
3. Make sure to include all newlines in the private key, using `\n` to represent them

## Starting the Application

### Option 1: Using the Batch File (Windows)

On Windows, you can use the provided batch file to start both server and client:

```
.\start.bat
```

### Option 2: Using PowerShell Script (Windows)

For PowerShell users:

```
.\start.ps1
```

### Option 3: Using Root Package Scripts

We've added convenience scripts in the root package.json:

```bash
# Start server
npm run start:server

# Start client
npm run start:client

# Fix Firebase configuration
npm run fix:firebase

# Fix client source map issues
npm run fix:client
```

### Option 4: Starting Manually

To start the server:
```
cd server
npm run dev
```

In a separate terminal, to start the client:
```
cd client
npm start
```

## PowerShell Command Issues

If you're having issues with commands in PowerShell that use the `&&` operator, use one of these alternatives:

1. Use semicolons (`;`) instead:
```
cd server; npm run dev
```

2. Use multiple commands:
```
cd server
npm run dev
```

3. Use the batch file provided (`start.bat`)

## Webpack Compilation Errors

If you're experiencing compilation errors related to source maps with the following packages:
- @reduxjs/toolkit
- react-redux
- react-toastify

### Solution 1: Use the Reinstall Script (Recommended)

We've created a dedicated script to fix module not found issues:

```bash
cd client
npm run reinstall-deps
```

This script will:
1. Uninstall the problematic packages
2. Clean the npm cache
3. Reinstall the packages
4. Apply source map fixes

### Solution 2: Use CRACO (Already Configured)

We've configured CRACO to handle these issues automatically:

1. Make sure you're starting the app with:
   ```bash
   npm start
   ```
   
   This will use CRACO instead of react-scripts directly.

### Solution 3: Fix Source Maps Manually

We've included a script to fix source map issues in problematic dependencies:

```bash
cd client
npm run fix-sourcemaps
```

This script removes problematic sourceMappingURL comments from the node_modules files.

### Solution 4: Module Not Found Errors

If you see errors like:
```
ERROR in ./node_modules/react-redux/es/index.js
Module build failed: Error: ENOENT: no such file or directory
```

This usually means there's a path resolution issue. Try these fixes:

1. Delete the client node_modules folder and reinstall:
   ```bash
   cd client
   rm -rf node_modules
   npm install
   ```

2. Use our reinstall script:
   ```bash
   cd client
   npm run reinstall-deps
   ```

## MongoDB vs Firebase

This project uses:
- Firebase Authentication for user login/signup
- MongoDB for data storage

The transition from Firebase to MongoDB for data storage is complete, but we still rely on Firebase for authentication.

## Additional Resources

- [Create React App + CRACO Documentation](https://craco.js.org/docs/getting-started/)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [MongoDB Node.js Driver Documentation](https://mongodb.github.io/node-mongodb-native/) 