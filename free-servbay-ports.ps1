$ErrorActionPreference = "Stop"

Write-Host "Stopping IIS services that occupy port 80..." -ForegroundColor Cyan

$services = @(
    @{ Name = "W3SVC"; StartupType = "Disabled" },
    @{ Name = "WAS"; StartupType = "Manual" }
)

foreach ($service in $services) {
    $current = Get-Service -Name $service.Name -ErrorAction SilentlyContinue

    if (-not $current) {
        continue
    }

    if ($current.Status -ne "Stopped") {
        Stop-Service -Name $service.Name -Force -ErrorAction Stop
    }

    Set-Service -Name $service.Name -StartupType $service.StartupType
}

Write-Host ""
Write-Host "Current listeners on 80/443:" -ForegroundColor Cyan
Get-NetTCPConnection -LocalPort 80,443 -State Listen -ErrorAction SilentlyContinue |
    Select-Object LocalPort, OwningProcess |
    Sort-Object LocalPort |
    Format-Table -AutoSize

Write-Host ""
Write-Host "Done. Restart ServBay and test http://khienha-api.host" -ForegroundColor Green
