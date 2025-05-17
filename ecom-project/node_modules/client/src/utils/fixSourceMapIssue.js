/**
 * This utility replaces improper source map references in node_modules
 * to fix the "Failed to parse source map" warnings during development.
 * 
 * The script targets the specific problematic packages:
 * - @reduxjs/toolkit
 * - react-redux
 * - react-toastify
 * 
 * Run this after installing or updating these packages.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Fixing source map issues for problematic dependencies...');

// Get the node_modules directory
const nodeModulesDir = path.resolve(__dirname, '../../node_modules');

// List of problematic packages
const problematicPackages = [
  '@reduxjs/toolkit',
  'react-redux',
  'react-toastify'
];

function removeSourceMapReferences(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) return false;
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it contains sourceMappingURL
    if (content.includes('sourceMappingURL')) {
      // Remove sourceMappingURL comments
      content = content.replace(/\/\/# sourceMappingURL=.+$/gm, '');
      
      // Write the updated content back
      fs.writeFileSync(filePath, content);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process each problematic package
let totalFixed = 0;
problematicPackages.forEach(packageName => {
  console.log(`\nProcessing package: ${packageName}`);
  const packageDir = path.join(nodeModulesDir, packageName);
  
  if (!fs.existsSync(packageDir)) {
    console.log(`  Package not installed: ${packageName}`);
    return;
  }
  
  // Find all JS files in the package
  const jsFiles = glob.sync(`${packageDir}/**/*.js`);
  console.log(`  Found ${jsFiles.length} JS files`);
  
  let fixedCount = 0;
  jsFiles.forEach(file => {
    if (removeSourceMapReferences(file)) {
      fixedCount++;
    }
  });
  
  console.log(`  Fixed ${fixedCount} files in ${packageName}`);
  totalFixed += fixedCount;
});

console.log(`\nCompleted! Fixed source map references in ${totalFixed} files.`);
console.log('You should no longer see "Failed to parse source map" warnings for these packages.'); 