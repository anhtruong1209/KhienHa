<?php

namespace Database\Seeders;

use App\Models\News;
use App\Support\DefaultNews;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        foreach (DefaultNews::make() as $item) {
            News::query()->updateOrCreate(
                ['slug' => $item['slug']],
                $item
            );
        }
    }
}
