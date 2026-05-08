param(
    [string] $ConfigPath = "",
    [string] $SourceRoot = "",
    [string] $FeRoot = "",
    [switch] $SkipBuild,
    [switch] $DryRun,
    [switch] $Yes,
    [switch] $IncludeEnv,
    [switch] $IncludeRuntimeStorage
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
if ([string]::IsNullOrWhiteSpace($ConfigPath)) {
    $ConfigPath = Join-Path $RepoRoot ".env.deploy.local"
}
if ([string]::IsNullOrWhiteSpace($SourceRoot)) {
    $SourceRoot = Join-Path $RepoRoot "KhienHaFull"
}
if ([string]::IsNullOrWhiteSpace($FeRoot)) {
    $FeRoot = Join-Path $RepoRoot "FE"
}

$SourceRoot = [System.IO.Path]::GetFullPath($SourceRoot)
$FeRoot = [System.IO.Path]::GetFullPath($FeRoot)
$ConfigPath = [System.IO.Path]::GetFullPath($ConfigPath)

function Read-DeployConfig {
    param([string] $Path)

    $config = @{}
    if (-not (Test-Path -LiteralPath $Path)) {
        return $config
    }

    foreach ($line in Get-Content -LiteralPath $Path -Encoding UTF8) {
        $trimmed = $line.Trim()
        if ($trimmed -eq "" -or $trimmed.StartsWith("#")) {
            continue
        }

        $parts = $trimmed -split "=", 2
        if ($parts.Count -ne 2) {
            continue
        }

        $key = $parts[0].Trim()
        $value = $parts[1].Trim()

        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        $config[$key] = $value
    }

    return $config
}

function Get-DeployValue {
    param(
        [hashtable] $Config,
        [string] $Name,
        [string] $Default = ""
    )

    if ($Config.ContainsKey($Name) -and -not [string]::IsNullOrWhiteSpace($Config[$Name])) {
        return $Config[$Name]
    }

    $envValue = [Environment]::GetEnvironmentVariable($Name)
    if (-not [string]::IsNullOrWhiteSpace($envValue)) {
        return $envValue
    }

    return $Default
}

function ConvertTo-PlainText {
    param([securestring] $SecureString)

    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

function Join-RemotePath {
    param(
        [string] $Base,
        [string] $Child
    )

    $basePath = ($Base -replace "\\", "/").TrimEnd("/")
    $childPath = ($Child -replace "\\", "/").TrimStart("/")

    if ([string]::IsNullOrWhiteSpace($basePath)) {
        return "/$childPath"
    }
    if ([string]::IsNullOrWhiteSpace($childPath)) {
        return $basePath
    }

    return "$basePath/$childPath"
}

function Get-RemoteParentPath {
    param([string] $Path)

    $normalized = ($Path -replace "\\", "/").TrimEnd("/")
    $lastSlash = $normalized.LastIndexOf("/")

    if ($lastSlash -le 0) {
        return "/"
    }

    return $normalized.Substring(0, $lastSlash)
}

function ConvertTo-FtpPath {
    param([string] $Path)

    $normalized = ($Path -replace "\\", "/").Trim()
    if ([string]::IsNullOrWhiteSpace($normalized) -or $normalized -eq ".") {
        return "/"
    }

    $hasLeadingSlash = $normalized.StartsWith("/")
    $segments = $normalized.Split("/", [System.StringSplitOptions]::RemoveEmptyEntries) | ForEach-Object {
        [Uri]::EscapeDataString($_)
    }

    $joined = $segments -join "/"
    if ($hasLeadingSlash) {
        return "/$joined"
    }

    return $joined
}

function Test-ExcludedPath {
    param([string] $RelativePath)

    $path = ($RelativePath -replace "\\", "/").TrimStart("/")

    if ($path -match "(^|/)\.git(/|$)") { return $true }
    if ($path -match "(^|/)node_modules(/|$)") { return $true }
    if ($path -match "(^|/)\.phpunit\.cache(/|$)") { return $true }
    if ($path -in @(".phpunit.result.cache", "auth.json")) { return $true }
    if (-not $IncludeEnv -and $path -in @(".env", ".env.backup", ".env.production")) { return $true }
    if ($path -like "storage/*.key") { return $true }
    if (-not $IncludeRuntimeStorage) {
        if ($path -like "storage/logs/*") { return $true }
        if ($path -like "storage/framework/cache/*") { return $true }
        if ($path -like "storage/framework/sessions/*") { return $true }
        if ($path -like "storage/framework/views/*") { return $true }
        if ($path -like "storage/pail/*") { return $true }
    }

    return $false
}

function New-FtpRequest {
    param(
        [string] $RemotePath,
        [string] $Method
    )

    $escapedPath = ConvertTo-FtpPath $RemotePath
    $uri = "ftp://$script:FtpHost`:$script:FtpPort$escapedPath"
    $request = [System.Net.FtpWebRequest]::Create($uri)
    $request.Method = $Method
    $request.Credentials = New-Object System.Net.NetworkCredential($script:FtpUser, $script:FtpPassword)
    $request.EnableSsl = $script:FtpSsl
    $request.UseBinary = $true
    $request.UsePassive = $true
    $request.KeepAlive = $false

    return $request
}

$script:CreatedDirectories = New-Object "System.Collections.Generic.HashSet[string]"

function Ensure-FtpDirectory {
    param([string] $RemotePath)

    $normalized = ($RemotePath -replace "\\", "/").Trim()
    if ([string]::IsNullOrWhiteSpace($normalized) -or $normalized -eq "/") {
        return
    }

    $leadingSlash = $normalized.StartsWith("/")
    $segments = $normalized.Split("/", [System.StringSplitOptions]::RemoveEmptyEntries)
    $current = if ($leadingSlash) { "" } else { "." }

    foreach ($segment in $segments) {
        if ($current -eq "." -or $current -eq "") {
            $current = if ($leadingSlash) { "/$segment" } else { $segment }
        }
        else {
            $current = Join-RemotePath $current $segment
        }

        if (-not $script:CreatedDirectories.Add($current)) {
            continue
        }

        if ($DryRun) {
            Write-Verbose "[dry-run] mkdir $current"
            continue
        }

        try {
            $request = New-FtpRequest $current ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)
            $response = $request.GetResponse()
            $response.Close()
        }
        catch [System.Net.WebException] {
            $response = $_.Exception.Response
            if ($null -ne $response) {
                $response.Close()
            }
            # Most FTP servers return 550 when the directory already exists.
        }
    }
}

function Upload-FtpFile {
    param(
        [string] $LocalPath,
        [string] $RemotePath
    )

    if ($DryRun) {
        Write-Verbose "[dry-run] upload $RemotePath"
        return
    }

    $fileInfo = Get-Item -LiteralPath $LocalPath
    $maxAttempts = 3

    for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
        try {
            $request = New-FtpRequest $RemotePath ([System.Net.WebRequestMethods+Ftp]::UploadFile)
            $request.ContentLength = $fileInfo.Length

            $sourceStream = [System.IO.File]::OpenRead($LocalPath)
            try {
                $requestStream = $request.GetRequestStream()
                try {
                    $sourceStream.CopyTo($requestStream, 65536)
                }
                finally {
                    $requestStream.Close()
                }
            }
            finally {
                $sourceStream.Close()
            }

            $response = $request.GetResponse()
            $response.Close()
            return
        }
        catch {
            if ($attempt -eq $maxAttempts) {
                throw
            }

            Start-Sleep -Seconds (2 * $attempt)
        }
    }
}

$config = Read-DeployConfig $ConfigPath
$script:FtpHost = Get-DeployValue $config "FTP_HOST"
$script:FtpUser = Get-DeployValue $config "FTP_USER"
$script:FtpPassword = Get-DeployValue $config "FTP_PASSWORD"
$script:FtpPort = [int](Get-DeployValue $config "FTP_PORT" "21")
$script:FtpSsl = (Get-DeployValue $config "FTP_SSL" "false") -match "^(1|true|yes|on)$"
$remoteDir = Get-DeployValue $config "FTP_REMOTE_DIR" "/"

if ($script:FtpHost -match "^ftp://") {
    $hostUri = [Uri]$script:FtpHost
    $script:FtpHost = $hostUri.Host
    if ($hostUri.Port -gt 0) {
        $script:FtpPort = $hostUri.Port
    }
    if ($remoteDir -eq "/" -and -not [string]::IsNullOrWhiteSpace($hostUri.AbsolutePath)) {
        $remoteDir = [Uri]::UnescapeDataString($hostUri.AbsolutePath)
    }
}

if ([string]::IsNullOrWhiteSpace($script:FtpHost)) {
    throw "Missing FTP_HOST. Create .env.deploy.local from scripts/deploy-ftp.example.env."
}
if ([string]::IsNullOrWhiteSpace($script:FtpUser)) {
    throw "Missing FTP_USER. Create .env.deploy.local from scripts/deploy-ftp.example.env."
}
if ([string]::IsNullOrWhiteSpace($script:FtpPassword) -and $DryRun) {
    $script:FtpPassword = "dry-run"
}
elseif ([string]::IsNullOrWhiteSpace($script:FtpPassword)) {
    $script:FtpPassword = ConvertTo-PlainText (Read-Host "FTP password" -AsSecureString)
}
if (-not (Test-Path -LiteralPath $SourceRoot -PathType Container)) {
    throw "SourceRoot does not exist: $SourceRoot"
}
if (-not (Test-Path -LiteralPath $FeRoot -PathType Container)) {
    throw "FeRoot does not exist: $FeRoot"
}

if (-not $SkipBuild) {
    Write-Host "Building static FE into KhienHaFull/public..."
    $npm = if ($env:OS -eq "Windows_NT") { "npm.cmd" } else { "npm" }
    Push-Location $FeRoot
    try {
        & $npm run build:public
        if ($LASTEXITCODE -ne 0) {
            throw "npm run build:public failed with exit code $LASTEXITCODE"
        }
    }
    finally {
        Pop-Location
    }
}

$files = @(Get-ChildItem -LiteralPath $SourceRoot -File -Recurse -Force | Where-Object {
    $relativePath = $_.FullName.Substring($SourceRoot.Length).TrimStart("\", "/")
    -not (Test-ExcludedPath $relativePath)
})

$totalBytes = ($files | Measure-Object -Property Length -Sum).Sum
if ($null -eq $totalBytes) {
    $totalBytes = 0
}

Write-Host ""
Write-Host "Deploy source : $SourceRoot"
Write-Host "FTP target    : ftp://$script:FtpHost`:$script:FtpPort$remoteDir"
Write-Host "FTP user      : $script:FtpUser"
Write-Host "FTPS enabled  : $script:FtpSsl"
Write-Host "Files         : $($files.Count)"
Write-Host ("Size          : {0:N2} MB" -f ($totalBytes / 1MB))
Write-Host "Skip .env     : $(-not $IncludeEnv)"
Write-Host ""

if (-not $Yes -and -not $DryRun) {
    $confirm = Read-Host "Type UPLOAD to start"
    if ($confirm -ne "UPLOAD") {
        Write-Host "Cancelled."
        exit 1
    }
}

Ensure-FtpDirectory $remoteDir

$runtimeDirectories = @(
    "storage",
    "storage/app",
    "storage/framework",
    "storage/framework/cache",
    "storage/framework/cache/data",
    "storage/framework/sessions",
    "storage/framework/views",
    "storage/logs",
    "bootstrap/cache"
)

foreach ($dir in $runtimeDirectories) {
    Ensure-FtpDirectory (Join-RemotePath $remoteDir $dir)
}

$index = 0
foreach ($file in $files) {
    $index++
    $relativePath = ($file.FullName.Substring($SourceRoot.Length).TrimStart("\", "/") -replace "\\", "/")
    $remotePath = Join-RemotePath $remoteDir $relativePath
    $remoteParent = Get-RemoteParentPath $remotePath

    Ensure-FtpDirectory $remoteParent

    Write-Progress -Activity "Uploading KhienHaFull via FTP" -Status "$index / $($files.Count): $relativePath" -PercentComplete (($index / [Math]::Max($files.Count, 1)) * 100)
    Upload-FtpFile $file.FullName $remotePath
}

Write-Progress -Activity "Uploading KhienHaFull via FTP" -Completed
Write-Host ""
Write-Host "Deploy finished."
if (-not $IncludeEnv) {
    Write-Host "Note: .env was not uploaded. Keep production .env configured on hosting."
}
