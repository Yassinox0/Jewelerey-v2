const axios = require('axios');

// Test the direct-create-admin endpoint
async function testDirectCreateAdmin() {
  try {
    console.log('Testing direct-create-admin endpoint...');
    const response = await axios.post('http://localhost:5000/direct-create-admin', {
      name: 'Admin User',
      email: 'admin3@example.com', // Using a different email
      password: 'admin123',
      secretKey: 'goyna-admin-secret'
    });
    
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test the routes endpoint to see what routes are registered
async function testRoutes() {
  try {
    console.log('\nTesting /test-routes endpoint...');
    const response = await axios.get('http://localhost:5000/test-routes');
    console.log('Registered routes:', response.data.routes);
    return true;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Run both tests
async function runTests() {
  await testRoutes();
  await testDirectCreateAdmin();
}

runTests(); 