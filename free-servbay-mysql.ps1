$ErrorActionPreference = "Stop"

Write-Host "Checking MySQL or MariaDB services..." -ForegroundColor Cyan

$serviceNames = Get-CimInstance Win32_Service |
    Where-Object { $_.Name -match 'mysql|mariadb' -or $_.DisplayName -match 'mysql|mariadb' } |
    Select-Object -ExpandProperty Name

foreach ($serviceName in ($serviceNames | Sort-Object -Unique)) {
    $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue

    if (-not $service) {
        continue
    }

    Write-Host "Stopping service $serviceName ..." -ForegroundColor Yellow

    if ($service.Status -ne "Stopped") {
        Stop-Service -Name $serviceName -Force -ErrorAction Stop
    }

    Set-Service -Name $serviceName -StartupType Disabled
}

$listeners = Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue

if ($listeners) {
    $processIds = $listeners | Select-Object -ExpandProperty OwningProcess -Unique

    foreach ($processId in $processIds) {
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue

        if ($process -and $process.ProcessName -match 'mysql|mariadb') {
            Write-Host "Stopping orphan process $($process.ProcessName) ($processId) ..." -ForegroundColor Yellow
            Stop-Process -Id $processId -Force -ErrorAction Stop
        }
    }
}

Write-Host ""
Write-Host "Current listeners on 3306:" -ForegroundColor Cyan
$remaining = Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue

if ($remaining) {
    $remaining |
        Select-Object LocalAddress, LocalPort, OwningProcess |
        Format-Table -AutoSize
} else {
    Write-Host "Port 3306 is free." -ForegroundColor Green
}

Write-Host ""
Write-Host "Done. You can now start MySQL in ServBay." -ForegroundColor Green
