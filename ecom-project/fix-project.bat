@echo off
echo === Goyna Jewelry E-commerce Fix Script ===
echo This script will fix common issues with the project
echo.

rem 1. Fix Firebase issues
echo Step 1: Fixing Firebase configuration...
echo.

cd server
node fix-private-key.js
if %ERRORLEVEL% NEQ 0 (
  echo Error: Firebase configuration fix failed.
  cd ..
  exit /b %ERRORLEVEL%
)
echo Firebase configuration fixed successfully.
cd ..

rem 2. Fix React dependencies
echo.
echo Step 2: Fixing client dependencies...
echo.

cd client

echo Removing problematic packages...
call npm uninstall @reduxjs/toolkit react-redux react-toastify

echo Cleaning npm cache...
call npm cache clean --force

echo Reinstalling packages...
call npm install @reduxjs/toolkit react-redux react-toastify

echo Fixing source maps...
call node src/utils/fixSourceMapIssue.js
if %ERRORLEVEL% NEQ 0 (
  echo Error: Source map fix failed.
  cd ..
  exit /b %ERRORLEVEL%
)

echo Client dependencies fixed successfully.
cd ..

echo.
echo All fixes applied successfully!
echo You can now start the application using:
echo   .\start.bat (for Windows Command Prompt)
echo   .\start.ps1 (for PowerShell)
echo.
echo Or start the components individually:
echo   Server: cd server ^&^& npm run dev
echo   Client: cd client ^&^& npm start 