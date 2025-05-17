# PowerShell script to fix common issues with the project
# This handles all common errors in one go

Write-Host "=== Goyna Jewelry E-commerce Fix Script ===" -ForegroundColor Cyan
Write-Host "This script will fix common issues with the project" -ForegroundColor Cyan

# 1. Fix Firebase issues
Write-Host "`nStep 1: Fixing Firebase configuration...`n" -ForegroundColor Yellow

$serverDir = Join-Path $PSScriptRoot "server"
$clientDir = Join-Path $PSScriptRoot "client"

# Check if the server directory exists
if (!(Test-Path $serverDir)) {
    Write-Host "Server directory not found at: $serverDir" -ForegroundColor Red
    exit 1
}

# Run the fix-private-key script
try {
    Set-Location $serverDir
    & node fix-private-key.js
    Write-Host "Firebase configuration fixed successfully." -ForegroundColor Green
}
catch {
    Write-Host "Error fixing Firebase configuration: $_" -ForegroundColor Red
}

# 2. Fix React dependencies
Write-Host "`nStep 2: Fixing client dependencies...`n" -ForegroundColor Yellow

# Check if the client directory exists
if (!(Test-Path $clientDir)) {
    Write-Host "Client directory not found at: $clientDir" -ForegroundColor Red
    exit 1
}

# Fix React dependencies
try {
    Set-Location $clientDir
    
    # Remove problematic packages
    Write-Host "Removing problematic packages..." -ForegroundColor Yellow
    & npm uninstall @reduxjs/toolkit react-redux react-toastify
    
    Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
    & npm cache clean --force

    # Reinstall packages
    Write-Host "Reinstalling packages..." -ForegroundColor Yellow
    & npm install @reduxjs/toolkit react-redux react-toastify
    
    # Fix source maps
    Write-Host "Fixing source maps..." -ForegroundColor Yellow
    & node src/utils/fixSourceMapIssue.js
    
    Write-Host "Client dependencies fixed successfully." -ForegroundColor Green
}
catch {
    Write-Host "Error fixing client dependencies: $_" -ForegroundColor Red
}

# 3. Return to the project root
Set-Location $PSScriptRoot

Write-Host "`nAll fixes applied successfully!" -ForegroundColor Green
Write-Host "You can now start the application using:" -ForegroundColor Cyan
Write-Host "  .\start.bat (for Windows Command Prompt)" -ForegroundColor White
Write-Host "  .\start.ps1 (for PowerShell)" -ForegroundColor White
Write-Host "`nOr start the components individually:" -ForegroundColor Cyan
Write-Host "  Server: cd server && npm run dev" -ForegroundColor White
Write-Host "  Client: cd client && npm start" -ForegroundColor White 