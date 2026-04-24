<?php

declare(strict_types=1);

use App\Models\News;
use App\Support\DefaultNews;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

try {
    $items = News::query()
        ->orderByDesc('published_at')
        ->get(['id', 'slug'])
        ->map(static fn (News $news): array => [
            'id' => (string) $news->id,
            'slug' => (string) $news->slug,
        ])
        ->values()
        ->all();
} catch (\Throwable) {
    $items = collect(DefaultNews::make())
        ->map(static fn (array $item): array => [
            'id' => (string) ($item['id'] ?? $item['slug'] ?? ''),
            'slug' => (string) ($item['slug'] ?? $item['id'] ?? ''),
        ])
        ->values()
        ->all();
}

echo json_encode([
    'news' => $items,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
