/**
 * Dependency Reinstallation Script
 * 
 * This script reinstalls problematic packages and fixes their source maps
 * to address webpack compilation errors.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const problematicPackages = [
  '@reduxjs/toolkit',
  'react-redux',
  'react-toastify'
];

console.log('=== Dependency Reinstallation Tool ===\n');
console.log('This script will reinstall the following packages to fix compilation issues:');
problematicPackages.forEach(pkg => console.log(`- ${pkg}`));

rl.question('\nProceed with reinstallation? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    try {
      // First check if node_modules exists
      const nodeModulesPath = path.join(__dirname, 'node_modules');
      if (!fs.existsSync(nodeModulesPath)) {
        console.log('\n⚠️ node_modules directory not found. Running full npm install first...');
        execSync('npm install', { stdio: 'inherit', cwd: __dirname });
      }

      // Uninstall problematic packages
      console.log('\n1. Uninstalling problematic packages...');
      execSync(`npm uninstall ${problematicPackages.join(' ')}`, { stdio: 'inherit', cwd: __dirname });

      // Clean npm cache
      console.log('\n2. Cleaning npm cache...');
      execSync('npm cache clean --force', { stdio: 'inherit', cwd: __dirname });

      // Reinstall packages
      console.log('\n3. Reinstalling packages...');
      execSync(`npm install ${problematicPackages.join(' ')}`, { stdio: 'inherit', cwd: __dirname });

      // Run the fix-sourcemaps script
      console.log('\n4. Fixing source maps...');
      execSync('node src/utils/fixSourceMapIssue.js', { stdio: 'inherit', cwd: __dirname });

      console.log('\n✅ Reinstallation complete! The webpack compilation errors should be fixed.');
      console.log('Please restart your development server with:');
      console.log('npm start');
    } catch (error) {
      console.error('\n❌ An error occurred:', error.message);
    }
  } else {
    console.log('Operation cancelled.');
  }
  
  rl.close();
}); 