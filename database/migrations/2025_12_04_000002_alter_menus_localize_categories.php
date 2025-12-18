<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Izinkan semua value lama + baru terlebih dulu agar update tidak gagal
        DB::statement("
            ALTER TABLE menus MODIFY COLUMN category ENUM(
                'food','foods','drink','drinks','dessert','desserts','pencuci_mulut',
                'makanan','minuman','paket_komplit'
            ) NOT NULL
        ");

        // Normalisasi nilai lama ke label baru
        DB::table('menus')->whereIn('category', ['food', 'foods'])->update(['category' => 'makanan']);
        DB::table('menus')->whereIn('category', ['drink', 'drinks'])->update(['category' => 'minuman']);
        DB::table('menus')->whereIn('category', ['dessert', 'desserts', 'pencuci_mulut'])->update(['category' => 'paket_komplit']);

        // Persempit enum ke label baru saja
        DB::statement("ALTER TABLE menus MODIFY COLUMN category ENUM('makanan','minuman','paket_komplit') NOT NULL");
    }

    public function down(): void
    {
        // Izinkan lagi semua value lama + baru
        DB::statement("
            ALTER TABLE menus MODIFY COLUMN category ENUM(
                'food','foods','drink','drinks','dessert','desserts','pencuci_mulut',
                'makanan','minuman','paket_komplit'
            ) NOT NULL
        ");

        // Kembalikan label lama
        DB::table('menus')->where('category', 'makanan')->update(['category' => 'food']);
        DB::table('menus')->where('category', 'minuman')->update(['category' => 'drink']);
        DB::table('menus')->where('category', 'paket_komplit')->update(['category' => 'dessert']);

        // Persempit ke enum awal
        DB::statement("ALTER TABLE menus MODIFY COLUMN category ENUM('food','drink','dessert') NOT NULL");
    }
};
