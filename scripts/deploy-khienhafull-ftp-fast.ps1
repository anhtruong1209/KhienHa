param(
    [string] $ConfigPath = "",
    [string] $SourceRoot = "",
    [string] $FeRoot = "",
    [switch] $SkipBuild,
    [switch] $DryRun,
    [switch] $Yes
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
if ([string]::IsNullOrWhiteSpace($ConfigPath)) { $ConfigPath = Join-Path $RepoRoot ".env.deploy.local" }
if ([string]::IsNullOrWhiteSpace($SourceRoot)) { $SourceRoot = Join-Path $RepoRoot "KhienHaFull" }
if ([string]::IsNullOrWhiteSpace($FeRoot)) { $FeRoot = Join-Path $RepoRoot "FE" }

$ConfigPath = [System.IO.Path]::GetFullPath($ConfigPath)
$SourceRoot = [System.IO.Path]::GetFullPath($SourceRoot)
$FeRoot = [System.IO.Path]::GetFullPath($FeRoot)

function Read-DeployConfig {
    param([string] $Path)

    $config = @{}
    if (-not (Test-Path -LiteralPath $Path)) { return $config }

    foreach ($line in Get-Content -LiteralPath $Path -Encoding UTF8) {
        $trimmed = $line.Trim()
        if ($trimmed -eq "" -or $trimmed.StartsWith("#")) { continue }
        $parts = $trimmed -split "=", 2
        if ($parts.Count -ne 2) { continue }
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
    param([hashtable] $Config, [string] $Name, [string] $Default = "")

    if ($Config.ContainsKey($Name) -and -not [string]::IsNullOrWhiteSpace($Config[$Name])) { return $Config[$Name] }
    $envValue = [Environment]::GetEnvironmentVariable($Name)
    if (-not [string]::IsNullOrWhiteSpace($envValue)) { return $envValue }
    return $Default
}

function ConvertTo-PlainText {
    param([securestring] $SecureString)

    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
    try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

function Join-RemotePath {
    param([string] $Base, [string] $Child)

    $basePath = ($Base -replace "\\", "/").TrimEnd("/")
    $childPath = ($Child -replace "\\", "/").TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($basePath)) { return "/$childPath" }
    if ([string]::IsNullOrWhiteSpace($childPath)) { return $basePath }
    return "$basePath/$childPath"
}

function ConvertTo-FtpPath {
    param([string] $Path)

    $normalized = ($Path -replace "\\", "/").Trim()
    if ([string]::IsNullOrWhiteSpace($normalized) -or $normalized -eq ".") { return "/" }
    $hasLeadingSlash = $normalized.StartsWith("/")
    $segments = $normalized.Split("/", [System.StringSplitOptions]::RemoveEmptyEntries) | ForEach-Object {
        [Uri]::EscapeDataString($_)
    }
    $joined = $segments -join "/"
    if ($hasLeadingSlash) { return "/$joined" }
    return $joined
}

function Test-ExcludedPath {
    param([string] $RelativePath)

    $path = ($RelativePath -replace "\\", "/").TrimStart("/")
    if ($path -match "(^|/)\.git(/|$)") { return $true }
    if ($path -match "(^|/)node_modules(/|$)") { return $true }
    if ($path -match "(^|/)\.phpunit\.cache(/|$)") { return $true }
    if ($path -in @(".env", ".env.backup", ".env.production", ".phpunit.result.cache", "auth.json")) { return $true }
    if ($path -like "storage/*.key") { return $true }
    if ($path -like "storage/logs/*") { return $true }
    if ($path -like "storage/framework/cache/*") { return $true }
    if ($path -like "storage/framework/sessions/*") { return $true }
    if ($path -like "storage/framework/views/*") { return $true }
    if ($path -like "storage/pail/*") { return $true }
    return $false
}

function New-FtpRequest {
    param([string] $RemotePath, [string] $Method)

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
    if ([string]::IsNullOrWhiteSpace($normalized) -or $normalized -eq "/") { return }
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
        if (-not $script:CreatedDirectories.Add($current)) { continue }
        if ($DryRun) { continue }

        try {
            $request = New-FtpRequest $current ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)
            $response = $request.GetResponse()
            $response.Close()
        }
        catch [System.Net.WebException] {
            if ($_.Exception.Response) { $_.Exception.Response.Close() }
        }
    }
}

function Upload-FtpFile {
    param([string] $LocalPath, [string] $RemotePath)

    if ($DryRun) {
        Write-Host "[dry-run] upload $RemotePath"
        return
    }

    $fileInfo = Get-Item -LiteralPath $LocalPath
    $request = New-FtpRequest $RemotePath ([System.Net.WebRequestMethods+Ftp]::UploadFile)
    $request.ContentLength = $fileInfo.Length

    $sourceStream = [System.IO.File]::OpenRead($LocalPath)
    try {
        $requestStream = $request.GetRequestStream()
        try { $sourceStream.CopyTo($requestStream, 1048576) }
        finally { $requestStream.Close() }
    }
    finally {
        $sourceStream.Close()
    }

    $response = $request.GetResponse()
    $response.Close()
}

function New-DeployExtractor {
    param([string] $Token)

    $source = @'
<?php
$token = '__TOKEN__';

if (! hash_equals($token, $_GET['token'] ?? '')) {
    http_response_code(403);
    exit('Forbidden');
}

register_shutdown_function(static function (): void {
    @unlink(__FILE__);
});

header('Content-Type: application/json; charset=utf-8');
set_time_limit(0);

try {
    if (! class_exists('ZipArchive')) {
        throw new RuntimeException('PHP ZipArchive extension is not enabled on this hosting.');
    }

    $root = realpath(__DIR__.'/..');
    if ($root === false) {
        throw new RuntimeException('Cannot resolve Laravel root.');
    }

    $zipPath = $root.'/storage/app/codex-deploy/khienhafull-deploy.zip';
    if (! is_file($zipPath)) {
        throw new RuntimeException('Deploy ZIP not found: '.$zipPath);
    }

    $zip = new ZipArchive();
    $openResult = $zip->open($zipPath);
    if ($openResult !== true) {
        throw new RuntimeException('Cannot open deploy ZIP. Code: '.$openResult);
    }

    $extracted = 0;

    for ($i = 0; $i < $zip->numFiles; $i++) {
        $name = str_replace('\\', '/', $zip->getNameIndex($i));
        $name = ltrim($name, '/');

        if ($name === '' || $name === '.' || str_contains($name, '/../') || str_starts_with($name, '../')) {
            continue;
        }

        $target = $root.'/'.$name;

        if (str_ends_with($name, '/')) {
            if (! is_dir($target)) {
                mkdir($target, 0775, true);
            }
            continue;
        }

        $parent = dirname($target);
        if (! is_dir($parent)) {
            mkdir($parent, 0775, true);
        }

        $source = $zip->getStream($name);
        if ($source === false) {
            continue;
        }

        $destination = fopen($target, 'wb');
        if ($destination === false) {
            fclose($source);
            throw new RuntimeException('Cannot write file: '.$target);
        }

        stream_copy_to_stream($source, $destination);
        fclose($destination);
        fclose($source);
        $extracted++;
    }

    $zip->close();
    @unlink($zipPath);

    foreach ([
        'storage/app',
        'storage/framework/cache/data',
        'storage/framework/sessions',
        'storage/framework/views',
        'storage/logs',
        'bootstrap/cache',
    ] as $directory) {
        $path = $root.'/'.$directory;
        if (! is_dir($path)) {
            mkdir($path, 0775, true);
        }
    }

    if (function_exists('opcache_reset')) {
        @opcache_reset();
    }

    echo json_encode([
        'ok' => true,
        'extracted' => $extracted,
        'root' => $root,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => $error->getMessage(),
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
'@

    return $source.Replace("__TOKEN__", $Token)
}

$config = Read-DeployConfig $ConfigPath
$script:FtpHost = Get-DeployValue $config "FTP_HOST"
$script:FtpUser = Get-DeployValue $config "FTP_USER"
$script:FtpPassword = Get-DeployValue $config "FTP_PASSWORD"
$script:FtpPort = [int](Get-DeployValue $config "FTP_PORT" "21")
$script:FtpSsl = (Get-DeployValue $config "FTP_SSL" "false") -match "^(1|true|yes|on)$"
$remoteDir = Get-DeployValue $config "FTP_REMOTE_DIR" "/home/khienha/htdocs"
$publicUrl = (Get-DeployValue $config "DEPLOY_PUBLIC_URL" "https://khienha.vn:8443").TrimEnd("/")

if ([string]::IsNullOrWhiteSpace($script:FtpHost)) { throw "Missing FTP_HOST." }
if ([string]::IsNullOrWhiteSpace($script:FtpUser)) { throw "Missing FTP_USER." }
if ([string]::IsNullOrWhiteSpace($script:FtpPassword) -and $DryRun) {
    $script:FtpPassword = "dry-run"
}
elseif ([string]::IsNullOrWhiteSpace($script:FtpPassword)) {
    $script:FtpPassword = ConvertTo-PlainText (Read-Host "FTP password" -AsSecureString)
}

if (-not $SkipBuild) {
    Write-Host "Building static FE into KhienHaFull/public..."
    $npm = if ($env:OS -eq "Windows_NT") { "npm.cmd" } else { "npm" }
    Push-Location $FeRoot
    try {
        & $npm run build:public
        if ($LASTEXITCODE -ne 0) { throw "npm run build:public failed with exit code $LASTEXITCODE" }
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
if ($null -eq $totalBytes) { $totalBytes = 0 }

Write-Host ""
Write-Host "Fast deploy source : $SourceRoot"
Write-Host "FTP target         : ftp://$script:FtpHost`:$script:FtpPort$remoteDir"
Write-Host "Public deploy URL  : $publicUrl/_codex_deploy.php"
Write-Host "Files in ZIP       : $($files.Count)"
Write-Host ("ZIP source size    : {0:N2} MB" -f ($totalBytes / 1MB))
Write-Host "Skip .env          : True"
Write-Host ""

if (-not $Yes -and -not $DryRun) {
    $confirm = Read-Host "Type UPLOAD to start fast ZIP deploy"
    if ($confirm -ne "UPLOAD") {
        Write-Host "Cancelled."
        exit 1
    }
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipPath = Join-Path $env:TEMP "khienhafull-deploy-$timestamp.zip"
$extractorPath = Join-Path $env:TEMP "_codex_deploy-$timestamp.php"
$tokenBytes = New-Object byte[] 24
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try {
    $rng.GetBytes($tokenBytes)
}
finally {
    $rng.Dispose()
}
$token = [Convert]::ToBase64String($tokenBytes).TrimEnd("=").Replace("+", "-").Replace("/", "_")

try {
    if (-not $DryRun) {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }

        $zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
        try {
            $index = 0
            foreach ($file in $files) {
                $index++
                $relativePath = ($file.FullName.Substring($SourceRoot.Length).TrimStart("\", "/") -replace "\\", "/")
                Write-Progress -Activity "Creating deploy ZIP" -Status "$index / $($files.Count): $relativePath" -PercentComplete (($index / [Math]::Max($files.Count, 1)) * 100)
                [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relativePath, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
            }
        }
        finally {
            $zip.Dispose()
            Write-Progress -Activity "Creating deploy ZIP" -Completed
        }

        Set-Content -LiteralPath $extractorPath -Value (New-DeployExtractor $token) -Encoding UTF8
    }

    $remoteZipDir = Join-RemotePath $remoteDir "storage/app/codex-deploy"
    $remoteZip = Join-RemotePath $remoteZipDir "khienhafull-deploy.zip"
    $remoteExtractor = Join-RemotePath $remoteDir "public/_codex_deploy.php"

    Ensure-FtpDirectory $remoteZipDir
    Ensure-FtpDirectory (Join-RemotePath $remoteDir "public")

    Upload-FtpFile $zipPath $remoteZip
    Upload-FtpFile $extractorPath $remoteExtractor

    if ($DryRun) {
        Write-Host "Dry run completed."
        exit 0
    }

    $zipSize = (Get-Item -LiteralPath $zipPath).Length
    Write-Host ("Uploaded ZIP       : {0:N2} MB" -f ($zipSize / 1MB))
    Write-Host "Extracting on server..."

    $extractUrl = "$publicUrl/_codex_deploy.php?token=$token"
    $response = Invoke-WebRequest -Uri $extractUrl -UseBasicParsing -TimeoutSec 900
    Write-Host $response.Content
    Write-Host "Fast deploy finished."
}
finally {
    Remove-Item -LiteralPath $zipPath -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $extractorPath -Force -ErrorAction SilentlyContinue
}
