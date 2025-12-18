<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE menus MODIFY COLUMN category ENUM('food','drink','dessert') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE menus MODIFY COLUMN category ENUM('food','drink') NOT NULL");
    }
};
