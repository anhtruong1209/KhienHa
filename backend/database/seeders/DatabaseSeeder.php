<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@khienha.vn')],
            [
                'name' => env('ADMIN_NAME', 'Khien Ha Admin'),
                'password' => env('ADMIN_PASSWORD', 'KhienHa@123456'),
            ]
        );

        $this->call([
            SiteContentSeeder::class,
            NewsSeeder::class,
        ]);
    }
}
