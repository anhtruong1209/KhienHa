<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE news MODIFY image_path LONGTEXT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE news MODIFY image_path VARCHAR(255) NULL');
    }
};
