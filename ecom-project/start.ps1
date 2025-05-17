# PowerShell script to start both server and client
# This handles the PowerShell-specific syntax for running multiple commands

Write-Host "Starting the Goyna Jewelry e-commerce application..." -ForegroundColor Cyan

# Function to check if a directory exists
function Test-DirectoryExists {
    param (
        [string]$Path
    )
    
    if (Test-Path -Path $Path -PathType Container) {
        return $true
    } else {
        Write-Host "Directory not found: $Path" -ForegroundColor Red
        return $false
    }
}

# Start the server
Write-Host "`nStarting server..." -ForegroundColor Yellow
if (Test-DirectoryExists -Path ".\server") {
    # Set the FIREBASE_PRIVATE_KEY in case file has issues
    $serviceAccountPath = Join-Path (Get-Location) "server\firebase-service-account.json"
    
    if (Test-Path $serviceAccountPath) {
        try {
            $serviceAccountContent = Get-Content $serviceAccountPath -Raw | ConvertFrom-Json
            $privateKey = $serviceAccountContent.private_key
            
            # Set environment variable with the private key
            $env:FIREBASE_PRIVATE_KEY = $privateKey
            $env:FIREBASE_PROJECT_ID = $serviceAccountContent.project_id
            $env:FIREBASE_CLIENT_EMAIL = $serviceAccountContent.client_email
            
            Write-Host "Firebase credentials loaded from service account file" -ForegroundColor Green
        }
        catch {
            Write-Host "Error reading service account file: $_" -ForegroundColor Red
        }
    }
    
    # Start the server in a new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit -Command cd '$((Get-Location).Path)\server'; npm run dev" -WindowStyle Normal
}
else {
    Write-Host "Server directory not found!" -ForegroundColor Red
    exit 1
}

# Wait for server to initialize
Write-Host "Waiting for server to initialize (5 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start the client
Write-Host "`nStarting client..." -ForegroundColor Yellow
if (Test-DirectoryExists -Path ".\client") {
    # Start the client in a new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit -Command cd '$((Get-Location).Path)\client'; npm start" -WindowStyle Normal
}
else {
    Write-Host "Client directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`nApplication starting..." -ForegroundColor Green
Write-Host "- Server running at: http://localhost:7777" -ForegroundColor Cyan
Write-Host "- Client running at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nNote: If the client fails to connect to the server, ensure the server has fully started before accessing the client application." -ForegroundColor Yellow 