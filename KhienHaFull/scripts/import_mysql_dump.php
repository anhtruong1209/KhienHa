<?php

declare(strict_types=1);

$projectRoot = dirname(__DIR__);
$envPath = $projectRoot . DIRECTORY_SEPARATOR . '.env';
$defaultDumpPath = $projectRoot . DIRECTORY_SEPARATOR . 'database' . DIRECTORY_SEPARATOR . 'dumps' . DIRECTORY_SEPARATOR . 'khienha-current.sql';
$dumpPath = $argv[1] ?? $defaultDumpPath;

if (! file_exists($envPath)) {
    fwrite(STDERR, "Khong tim thay file .env. Hay copy .env.quickstart.example thanh .env truoc.\n");
    exit(1);
}

if (! file_exists($dumpPath)) {
    fwrite(STDERR, "Khong tim thay file SQL: {$dumpPath}\n");
    exit(1);
}

$env = parseEnvFile($envPath);

$host = $env['DB_HOST'] ?? '127.0.0.1';
$port = (int) ($env['DB_PORT'] ?? 3306);
$user = $env['DB_USERNAME'] ?? 'root';
$password = $env['DB_PASSWORD'] ?? '';

$mysqli = mysqli_init();

if (! $mysqli) {
    fwrite(STDERR, "Khong the khoi tao mysqli.\n");
    exit(1);
}

$mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 15);

if (! $mysqli->real_connect($host, $user, $password, null, $port)) {
    fwrite(STDERR, "Ket noi MySQL that bai: " . mysqli_connect_error() . "\n");
    exit(1);
}

$mysqli->set_charset('utf8mb4');

$sql = file_get_contents($dumpPath);

if ($sql === false) {
    fwrite(STDERR, "Khong doc duoc file SQL.\n");
    $mysqli->close();
    exit(1);
}

echo "Dang import: {$dumpPath}\n";
echo "MySQL: {$user}@{$host}:{$port}\n";

if (! $mysqli->multi_query($sql)) {
    fwrite(STDERR, "Import that bai: {$mysqli->error}\n");
    $mysqli->close();
    exit(1);
}

do {
    if ($result = $mysqli->store_result()) {
        $result->free();
    }

    if ($mysqli->errno) {
        fwrite(STDERR, "Import that bai: {$mysqli->error}\n");
        $mysqli->close();
        exit(1);
    }
} while ($mysqli->more_results() && $mysqli->next_result());

echo "Import thanh cong.\n";
$mysqli->close();

function parseEnvFile(string $path): array
{
    $values = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    if ($lines === false) {
        return $values;
    }

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || str_starts_with($line, '#') || ! str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        if ($value !== '' && (($value[0] === '"' && str_ends_with($value, '"')) || ($value[0] === "'" && str_ends_with($value, "'")))) {
            $value = substr($value, 1, -1);
        }

        $values[$key] = $value;
    }

    return $values;
}
