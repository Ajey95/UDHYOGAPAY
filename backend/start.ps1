# Udhyoga Pay Backend - START Script
# This script kills any existing process on port 5000 and starts the backend

Write-Host "=========================================="
Write-Host "  STARTING UDHYOGA PAY BACKEND"
Write-Host "=========================================="
Write-Host ""

# Step 1: Check if port 5000 is in use
Write-Host "Checking port 5000..." -ForegroundColor Yellow
$processInfo = netstat -ano | findstr ":5000"

if ($processInfo) {
    Write-Host "Port 5000 is in use. Killing existing process..." -ForegroundColor Yellow
    
    # Extract and kill processes
    $processInfo | ForEach-Object {
        if ($_ -match "(\d+)\s*$") {
            $targetProcess = $Matches[1]
            Write-Host "  Killing process: $targetProcess" -ForegroundColor Gray
            Stop-Process -Id $targetProcess -Force -ErrorAction SilentlyContinue
        }
    }
    
    Write-Host "  Waiting 2 seconds..." -ForegroundColor Gray
    Start-Sleep -Seconds 2
}

# Step 2: Navigate to backend directory
$backendPath = "C:\udhyogapay\backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "Error: Backend directory not found at $backendPath" -ForegroundColor Red
    exit 1
}

Set-Location $backendPath

# Step 3: Start the backend server
Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Green
Write-Host ""
Write-Host "=========================================="
Write-Host ""

# Run npm run dev
npm run dev
