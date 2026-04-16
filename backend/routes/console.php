<?php

use App\Support\Base64ImageBackfillService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('media:backfill-base64', function () {
    $this->info('Converting existing media references to base64...');

    $result = app(Base64ImageBackfillService::class)->run();

    $this->newLine();
    $this->info('Site content');
    $this->line('  Converted: '.($result['site_content']['converted'] ?? 0));
    $this->line('  Unchanged: '.($result['site_content']['unchanged'] ?? 0));

    $this->newLine();
    $this->info('News');
    $this->line('  Total: '.($result['news']['total'] ?? 0));
    $this->line('  Converted: '.($result['news']['converted'] ?? 0));
    $this->line('  Unchanged: '.($result['news']['unchanged'] ?? 0));

    $this->newLine();
    $this->info('Done.');
})->purpose('Backfill stored image URLs/paths into base64 data URIs');
