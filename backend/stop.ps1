# Udhyoga Pay Backend - STOP Script
# This script stops the backend server by killing the process using port 5000

Write-Host "=========================================="
Write-Host "  STOPPING UDHYOGA PAY BACKEND"
Write-Host "=========================================="
Write-Host ""

# Check if port 5000 is in use
$processInfo = netstat -ano | findstr ":5000"

if ($processInfo) {
    Write-Host "Finding processes using port 5000..." -ForegroundColor Yellow
    
    $killedCount = 0
    $processInfo | ForEach-Object {
        if ($_ -match "(\d+)\s*$") {
            $targetProcess = $Matches[1]
            Write-Host "  Stopping process: $targetProcess" -ForegroundColor Gray
            Stop-Process -Id $targetProcess -Force -ErrorAction SilentlyContinue
            $killedCount++
        }
    }
    
    Write-Host ""
    Write-Host "[OK] Stopped $killedCount process(es)" -ForegroundColor Green
} else {
    Write-Host "[INFO] No process is using port 5000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=========================================="
Write-Host ""
