# Udhyoga Pay Backend - STATUS Script
# This script checks the status of the backend server

Write-Host "=========================================="
Write-Host "  UDHYOGA PAY BACKEND STATUS"
Write-Host "=========================================="
Write-Host ""

# Check if port 5000 is in use
$processInfo = netstat -ano | findstr ":5000"

if ($processInfo) {
    Write-Host "[RUNNING] Backend server is active" -ForegroundColor Green
    Write-Host ""
    
    # Extract PID
    $lines = $processInfo -split "`n"
    foreach ($line in $lines) {
        if ($line -match "LISTENING\s+(\d+)") {
            $processId = $matches[1]
            Write-Host "Process ID: $processId" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    
    # Test health endpoint
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 3
        if ($health.success) {
            Write-Host "[OK] Health endpoint responding" -ForegroundColor Green
            Write-Host "    Server Time: $($health.timestamp)" -ForegroundColor DarkGray
        }
    } catch {
        Write-Host "[WARN] Server running but not responding" -ForegroundColor Yellow
    }
    
    Write-Host ""
    
    # Test root endpoint
    try {
        $root = Invoke-RestMethod -Uri "http://localhost:5000/" -TimeoutSec 3
        if ($root.success) {
            Write-Host "[OK] API root responding (v$($root.version))" -ForegroundColor Green
        }
    } catch {
        Write-Host "[WARN] API not responding" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "[STOPPED] Backend server is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start the server, run:" -ForegroundColor Yellow
    Write-Host "  .\start.ps1" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=========================================="
Write-Host ""

# Quick reference
Write-Host "Quick Commands:" -ForegroundColor Gray
Write-Host "  Start:  .\start.ps1" -ForegroundColor DarkGray
Write-Host "  Stop:   .\stop.ps1" -ForegroundColor DarkGray
Write-Host "  Status: .\status.ps1" -ForegroundColor DarkGray
Write-Host "  Test:   .\verify-backend.ps1" -ForegroundColor DarkGray
Write-Host ""
