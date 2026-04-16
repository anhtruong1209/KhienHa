<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use App\Support\DefaultSiteContent;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        SiteContent::query()->updateOrCreate(
            ['key' => 'homepage'],
            ['payload' => DefaultSiteContent::make()]
        );
    }
}
