const fs = require('fs');
const path = require('path');

// Define the content of the .env file
const envContent = `PORT=5000
STRIPE_SECRET_KEY=your_stripe_secret_key_here
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key

# Database configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=goyna_jewelry`;

// Define the path to the .env file
const envPath = path.join(__dirname, '.env');

// Write the content to the .env file
fs.writeFileSync(envPath, envContent);

console.log('.env file created successfully!');
console.log('Content:');
console.log(envContent.replace(/STRIPE_SECRET_KEY=.*$/m, 'STRIPE_SECRET_KEY=********'));

console.log('\nIMPORTANT: Replace the placeholder values with your actual API keys and secrets.');
console.log('DO NOT commit the .env file to version control.'); 