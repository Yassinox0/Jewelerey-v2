/**
 * This script will log all the registered routes in the Express app
 * Run with: node route-test.js
 */

const express = require('express');
const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Print all registered routes
console.log('Registered Routes:');
console.log('==================');

// Function to print routes
function printRoutes(stack, basePath = '') {
  stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .filter(method => layer.route.methods[method])
        .map(method => method.toUpperCase())
        .join(', ');
      console.log(`${methods} ${basePath}${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      // If this is a router middleware, recursively print its routes
      const newBasePath = basePath + (layer.regexp.toString().includes('^\\/') ? layer.regexp.toString().replace(/^.*\/\^\\\/(.*)[\?].*$/, '$1').replace(/\\\//g, '/') : '');
      printRoutes(layer.handle.stack, `${newBasePath}/`);
    }
  });
}

// Print Express app routes
printRoutes(app._router.stack);

// Also test the create-admin endpoint directly
const axios = require('axios');

async function testCreateAdmin() {
  try {
    console.log('\nTesting /api/auth/create-admin endpoint:');
    console.log('=====================================');
    
    const response = await axios.post('http://localhost:5000/api/auth/create-admin', {
      name: 'Admin User',
      email: 'admin2@example.com',
      password: 'admin123',
      secretKey: 'goyna-admin-secret'
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

// Only run this if the server is already running
console.log('\nTo test the endpoints, make sure the server is running in another terminal');
console.log('Then uncomment the testCreateAdmin() line at the bottom of this file and run this script again');

// Uncomment the next line to test the endpoint
// testCreateAdmin(); 