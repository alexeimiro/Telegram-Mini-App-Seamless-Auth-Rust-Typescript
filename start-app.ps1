# Function to check if a port is in use
function Test-PortInUse {
    param($port)
    $portInUse = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
    return $null -ne $portInUse
}

# Kill any existing processes on ports 3000 and 5173
if (Test-PortInUse 3000) {
    Write-Host "Port 3000 is in use. Stopping existing process..."
    Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess -Force
}

if (Test-PortInUse 5173) {
    Write-Host "Port 5173 is in use. Stopping existing process..."
    Stop-Process -Id (Get-NetTCPConnection -LocalPort 5173 -State Listen).OwningProcess -Force
}

# Start backend server
Write-Host "Starting backend server..."
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; cargo run" -PassThru

# Wait for backend to start
Write-Host "Waiting for backend server to start..."
$attempts = 0
$maxAttempts = 30
while (-not (Test-PortInUse 3000) -and $attempts -lt $maxAttempts) {
    Start-Sleep -Seconds 1
    $attempts++
}

if (-not (Test-PortInUse 3000)) {
    Write-Host "Backend server failed to start. Please check the logs."
    exit 1
}

# Start frontend server
Write-Host "Starting frontend server..."
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -PassThru

# Wait for frontend to start
Write-Host "Waiting for frontend server to start..."
$attempts = 0
while (-not (Test-PortInUse 5173) -and $attempts -lt $maxAttempts) {
    Start-Sleep -Seconds 1
    $attempts++
}

if (-not (Test-PortInUse 5173)) {
    Write-Host "Frontend server failed to start. Please check the logs."
    exit 1
}

# Start localtunnel
Write-Host "Starting localtunnel..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npx localtunnel --port 5173 --subdomain customer-support-app"

# Display URLs
Write-Host "`nServer URLs:"
Write-Host "Backend: http://localhost:3000"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Public Frontend URL: https://customer-support-app.loca.lt"
Write-Host "`nPress Ctrl+C to stop all servers and tunnel"

# Wait for user input
Write-Host "`nPress any key to stop all servers..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop all processes
if ($backendProcess) { Stop-Process -Id $backendProcess.Id -Force }
if ($frontendProcess) { Stop-Process -Id $frontendProcess.Id -Force }

Write-Host "All servers stopped." 