<?php
declare(strict_types=1);

const RUN_TOKEN = 'khienha-20260508-9f8b2f3f7df94d5d9c0b0f2b';

header('Content-Type: text/plain; charset=utf-8');

if (!hash_equals(RUN_TOKEN, (string) ($_GET['token'] ?? ''))) {
    http_response_code(403);
    echo "Forbidden\n";
    exit;
}

set_time_limit(600);
ini_set('display_errors', '1');
error_reporting(E_ALL);

function findLaravelRoot(): string
{
    $candidates = [
        __DIR__,
        dirname(__DIR__),
        dirname(__DIR__, 2),
        '/home/khienha/htdocs',
    ];

    foreach ($candidates as $candidate) {
        if (is_file($candidate.'/artisan') && is_file($candidate.'/bootstrap/app.php')) {
            return realpath($candidate) ?: $candidate;
        }
    }

    throw new RuntimeException('Cannot find Laravel root. Put this file inside /home/khienha/htdocs/khienha.vn/.');
}

function readEnvValue(string $envFile, string $key): ?string
{
    if (!is_file($envFile)) {
        return null;
    }

    foreach (file($envFile, FILE_IGNORE_NEW_LINES) ?: [] as $line) {
        $trimmed = trim($line);
        if ($trimmed === '' || str_starts_with($trimmed, '#')) {
            continue;
        }

        [$name, $value] = array_pad(explode('=', $trimmed, 2), 2, '');
        if (trim($name) !== $key) {
            continue;
        }

        $value = trim($value);
        if (
            strlen($value) >= 2
            && (($value[0] === '"' && substr($value, -1) === '"') || ($value[0] === "'" && substr($value, -1) === "'"))
        ) {
            $value = substr($value, 1, -1);
        }

        return $value;
    }

    return null;
}

function runArtisan(Illuminate\Contracts\Console\Kernel $kernel, string $command, array $parameters = []): void
{
    echo ">>> php artisan {$command}";
    foreach ($parameters as $name => $value) {
        if ($value === true) {
            echo " {$name}";
        }
    }
    echo "\n";

    $exitCode = $kernel->call($command, $parameters);
    echo $kernel->output()."\n";

    if ($exitCode !== 0) {
        throw new RuntimeException("Command failed with exit code {$exitCode}: {$command}");
    }
}

try {
    $root = findLaravelRoot();
    $envFile = $root.'/.env';

    echo "Laravel root: {$root}\n";
    echo 'DB_DATABASE: '.(readEnvValue($envFile, 'DB_DATABASE') ?: '<empty>')."\n";
    echo 'DB_USERNAME: '.(readEnvValue($envFile, 'DB_USERNAME') ?: '<empty>')."\n";
    echo 'DB_PASSWORD: '.((readEnvValue($envFile, 'DB_PASSWORD') ?: '') === '' ? '<empty>' : '<set>')."\n\n";

    if ((readEnvValue($envFile, 'DB_PASSWORD') ?: '') === '') {
        throw new RuntimeException('DB_PASSWORD is empty in '.$envFile.'. Edit .env first, then run this file again.');
    }

    if (($_GET['run'] ?? '') !== '1') {
        echo "Preflight OK. Add &run=1 to the URL to execute artisan commands.\n";
        exit;
    }

    $configCache = $root.'/bootstrap/cache/config.php';
    if (is_file($configCache)) {
        unlink($configCache);
        echo "Deleted cached config: {$configCache}\n\n";
    }

    chdir($root);

    require $root.'/vendor/autoload.php';
    $app = require $root.'/bootstrap/app.php';

    /** @var Illuminate\Contracts\Console\Kernel $kernel */
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

    runArtisan($kernel, 'config:clear');
    runArtisan($kernel, 'route:clear');
    runArtisan($kernel, 'view:clear');
    runArtisan($kernel, 'migrate', ['--seed' => true, '--force' => true]);
    runArtisan($kernel, 'cache:clear');

    echo "DONE. Delete this file from the server now: ".__FILE__."\n";
} catch (Throwable $e) {
    http_response_code(500);
    echo "ERROR: ".$e->getMessage()."\n";
    echo $e->getFile().':'.$e->getLine()."\n";
}
