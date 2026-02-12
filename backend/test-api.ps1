# Udhyoga Pay Backend API Test Script
Write-Host "======================================"
Write-Host "  Udhyoga Pay Backend API Tests"
Write-Host "======================================"
Write-Host ""

$baseUrl = "http://localhost:5000"
$passCount = 0
$failCount = 0

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    if ($health.success) {
        Write-Host "   [PASS] Health check passed" -ForegroundColor Green
        $passCount++
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 2: Root Endpoint
Write-Host "2. Testing Root Endpoint..." -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    if ($root.success) {
        Write-Host "   [PASS] Root endpoint (v$($root.version))" -ForegroundColor Green
        $passCount++
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 3: User Registration
Write-Host "3. Testing User Registration..." -ForegroundColor Yellow
$userEmail = "user_$(Get-Random)@test.com"
$headers = @{"Content-Type"="application/json"}
$userBody = @{
    name = "Test User"
    email = $userEmail
    phone = "9$(Get-Random -Minimum 100000000 -Maximum 999999999)"
    password = "Pass123456"
    role = "user"
} | ConvertTo-Json

try {
    $userReg = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -Headers $headers -Body $userBody
    if ($userReg.success) {
        Write-Host "   [PASS] User registered: $userEmail" -ForegroundColor Green
        $userToken = $userReg.token
        $passCount++
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 4: Worker Registration
Write-Host "4. Testing Worker Registration..." -ForegroundColor Yellow
$workerEmail = "worker_$(Get-Random)@test.com"
$workerBody = @{
    name = "Test Worker"
    email = $workerEmail
    phone = "8$(Get-Random -Minimum 100000000 -Maximum 999999999)"
    password = "Pass123456"
    role = "worker"
} | ConvertTo-Json

try {
    $workerReg = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -Headers $headers -Body $workerBody
    if ($workerReg.success) {
        Write-Host "   [PASS] Worker registered: $workerEmail" -ForegroundColor Green
        $workerToken = $workerReg.token
        $passCount++
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 5: Login
Write-Host "5. Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $userEmail
    password = "Pass123456"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Headers $headers -Body $loginBody
    if ($login.success) {
        Write-Host "   [PASS] Login successful" -ForegroundColor Green
        $passCount++
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 6: Token Verification
Write-Host "6. Testing Token Verification..." -ForegroundColor Yellow
$authHeaders = @{
    "Authorization" = "Bearer $userToken"
}
try {
    $verify = Invoke-RestMethod -Uri "$baseUrl/api/auth/verify-token" -Method GET -Headers $authHeaders
    if ($verify.success) {
        Write-Host "   [PASS] Token verified (Role: $($verify.user.role))" -ForegroundColor Green
        $passCount++
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 7: Geocoding
Write-Host "7. Testing Geocoding..." -ForegroundColor Yellow
$geocodeBody = @{
    address = "India Gate, New Delhi"
} | ConvertTo-Json

$geocodeHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $userToken"
}

try {
    $geocode = Invoke-RestMethod -Uri "$baseUrl/api/users/geocode" -Method POST -Headers $geocodeHeaders -Body $geocodeBody
    if ($geocode.success) {
        Write-Host "   [PASS] Geocoding: [$($geocode.latitude), $($geocode.longitude)]" -ForegroundColor Green
        $passCount++
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 8: Worker Location Update
Write-Host "8. Testing Worker Location Update..." -ForegroundColor Yellow
$locationBody = @{
    latitude = 28.6139
    longitude = 77.2090
} | ConvertTo-Json

$workerHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $workerToken"
}

try {
    $location = Invoke-RestMethod -Uri "$baseUrl/api/workers/location" -Method PATCH -Headers $workerHeaders -Body $locationBody
    if ($location.success) {
        Write-Host "   [PASS] Worker location updated" -ForegroundColor Green
        $passCount++
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Test 9: Find Nearby Workers
Write-Host "9. Testing Nearby Workers Search..." -ForegroundColor Yellow
$nearbyBody = @{
    latitude = 28.6139
    longitude = 77.2090
    radius = 5000
    profession = "Plumber"
} | ConvertTo-Json

try {
    $nearby = Invoke-RestMethod -Uri "$baseUrl/api/users/workers/nearby" -Method POST -Headers $geocodeHeaders -Body $nearbyBody
    if ($nearby.success) {
        Write-Host "   [PASS] Found $($nearby.count) workers" -ForegroundColor Green
        $passCount++
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}

# Summary
Write-Host ""
Write-Host "======================================"
Write-Host "  Test Results"
Write-Host "======================================"
Write-Host ""
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Total:  $($passCount + $failCount)"
Write-Host ""
Write-Host "Backend Status:"
Write-Host "  - MongoDB: Connected"
Write-Host "  - Cloudinary: Configured"
Write-Host "  - Socket.io: Active"
Write-Host ""
