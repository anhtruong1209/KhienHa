<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$connection = DB::connection();
$pdo = $connection->getPdo();
$database = $connection->getDatabaseName();
$outputPath = $argv[1] ?? __DIR__."/../database/dumps/{$database}-current.sql";

$schemaStatement = $pdo->prepare(
    'SELECT default_character_set_name, default_collation_name
     FROM information_schema.schemata
     WHERE schema_name = ?'
);
$schemaStatement->execute([$database]);
$schema = $schemaStatement->fetch(PDO::FETCH_ASSOC) ?: [
    'default_character_set_name' => 'utf8mb4',
    'default_collation_name' => 'utf8mb4_unicode_ci',
];

$tablesStatement = $pdo->prepare(
    "SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = ?
       AND table_type = 'BASE TABLE'
     ORDER BY table_name"
);
$tablesStatement->execute([$database]);
$tables = $tablesStatement->fetchAll(PDO::FETCH_COLUMN);

if (! is_array($tables) || $tables === []) {
    fwrite(STDERR, "Khong tim thay bang nao trong database {$database}.\n");
    exit(1);
}

$outputDir = dirname($outputPath);

if (! is_dir($outputDir) && ! mkdir($outputDir, 0777, true) && ! is_dir($outputDir)) {
    fwrite(STDERR, "Khong tao duoc thu muc output: {$outputDir}\n");
    exit(1);
}

$handle = fopen($outputPath, 'wb');

if ($handle === false) {
    fwrite(STDERR, "Khong mo duoc file output: {$outputPath}\n");
    exit(1);
}

$charset = $schema['default_character_set_name'] ?? 'utf8mb4';
$collation = $schema['default_collation_name'] ?? 'utf8mb4_unicode_ci';

fwrite($handle, "-- Khien Ha current database dump\n");
fwrite($handle, '-- Generated at '.date('Y-m-d H:i:s')."\n");
fwrite($handle, "-- Database: `{$database}`\n\n");
fwrite($handle, "CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET {$charset} COLLATE {$collation};\n");
fwrite($handle, "USE `{$database}`;\n\n");
fwrite($handle, "SET NAMES {$charset};\n");
fwrite($handle, "SET FOREIGN_KEY_CHECKS=0;\n\n");

foreach ($tables as $table) {
    $createStatement = $pdo->query("SHOW CREATE TABLE `{$table}`");
    $createRow = $createStatement?->fetch(PDO::FETCH_ASSOC);

    if (! is_array($createRow)) {
        fwrite(STDERR, "Khong doc duoc cau truc bang {$table}.\n");
        fclose($handle);
        exit(1);
    }

    $createSql = array_values($createRow)[1] ?? null;

    if (! is_string($createSql) || $createSql === '') {
        fwrite(STDERR, "Khong lay duoc lenh CREATE TABLE cho bang {$table}.\n");
        fclose($handle);
        exit(1);
    }

    fwrite($handle, "-- --------------------------------------------------\n");
    fwrite($handle, "-- Table: `{$table}`\n");
    fwrite($handle, "-- --------------------------------------------------\n");
    fwrite($handle, "DROP TABLE IF EXISTS `{$table}`;\n");
    fwrite($handle, $createSql.";\n\n");

    $dataStatement = $pdo->query("SELECT * FROM `{$table}`");

    if ($dataStatement === false) {
        fwrite(STDERR, "Khong doc duoc du lieu bang {$table}.\n");
        fclose($handle);
        exit(1);
    }

    $columns = [];
    $rows = [];
    $rowCount = 0;

    while ($row = $dataStatement->fetch(PDO::FETCH_ASSOC)) {
        if ($columns === []) {
            $columns = array_map(
                static fn (string $column): string => "`{$column}`",
                array_keys($row)
            );
        }

        $rows[] = '('.implode(', ', array_map(
            static fn (mixed $value): string => sqlLiteral($value, $pdo),
            array_values($row)
        )).')';
        $rowCount++;

        if (count($rows) === 100) {
            writeInsertStatement($handle, $table, $columns, $rows);
            $rows = [];
        }
    }

    if ($rows !== []) {
        writeInsertStatement($handle, $table, $columns, $rows);
    } elseif ($rowCount === 0) {
        fwrite($handle, "-- Table `{$table}` has no rows.\n\n");
    }
}

fwrite($handle, "SET FOREIGN_KEY_CHECKS=1;\n");
fclose($handle);

fwrite(STDOUT, "Da tao file dump: {$outputPath}\n");

function writeInsertStatement($handle, string $table, array $columns, array $rows): void
{
    fwrite(
        $handle,
        "INSERT INTO `{$table}` (".implode(', ', $columns).") VALUES\n".
        implode(",\n", $rows).";\n\n"
    );
}

function sqlLiteral(mixed $value, PDO $pdo): string
{
    if ($value === null) {
        return 'NULL';
    }

    if (is_bool($value)) {
        return $value ? '1' : '0';
    }

    if (is_int($value) || is_float($value)) {
        return (string) $value;
    }

    return $pdo->quote((string) $value);
}
