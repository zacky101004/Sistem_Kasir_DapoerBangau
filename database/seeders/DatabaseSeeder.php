<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Level;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        level::create([
            'level' => 'manager'
        ]);

        level::create([
           'level' => 'cashier' 
        ]);

        level::create([
           'level' => 'admin' 
        ]);

        User::create([
            'level_id' => '1',
            'name' => 'Aldy Ramadhan',
            'username' => 'manager',
            'password' => bcrypt('asd321')
        ]);

        User::create([
            'level_id' => '2',
            'name' => 'Muhammad Galang',
            'username' => 'cashier',
            'password' => bcrypt('asd321')
        ]);

        User::create([
            'level_id' => '3',
            'name' => 'Sophia',
            'username' => 'admin',
            'password' => bcrypt('asd321')
        ]);

        $menuData = [
            [
                'name' => 'Carne Guisada',
                'modal' => '68000',
                'price' => '80000',
                'description' => '<div><strong>Consisting of<br></strong>- rice with, <strong><br></strong>- beef cut into small pieces and cooked in a blend of spices.</div>',
                'picture' => 'image.png',
                'category' => 'food'
            ],
            [
                'name' => 'shrimp paella',
                'modal' => '100000',
                'price' => '150000',
                'description' => '<div><strong>Consisting of</strong>&nbsp;<br>- paella rice served with fresh shrimp,&nbsp;<br>- spices such as saffron and paprika,&nbsp;<br>- vegetables like bell peppers, onions, and tomatoes&nbsp;</div>',
                'picture' => 'image.png',
                'category' => 'food'
            ],
            [
                'name' => 'Beef Stroganoff',
                'modal' => '200000',
                'price' => '250000',
                'description' => '<div><strong>Consisting of <br></strong>- Made with the finest beef in Russia,<br>-served with rice, pasta, or mashed potatoes.</div>',
                'picture' => 'image.png',
                'category' => 'food'
            ],
            [
                'name' => 'Chicken Tikka Masala',
                'modal' => '80000',
                'price' => '100000',
                'description' => '<div><strong>Consisting of</strong> <strong><br></strong>- chicken pieces with,<br>- a rich and spiced creamy sauce.</div>',
                'picture' => 'image.png',
                'category' => 'food'
            ],
            [
                'name' => 'Spiralized Chicken',
                'modal' => '135000',
                'price' => '150000',
                'description' => '<div><strong>Consisting of </strong><br>- chicken pieces processed using a spiralizer technique to create spiral shapes resembling pasta.<br>- Served with sauce and vegetables.</div>',
                'picture' => 'image.png',
                'category' => 'food'
            ],
            [
                'name' => 'Caesar Salat',
                'modal' => '100000',
                'price' => '120000',
                'description' => '<div><strong>Consisting of <br></strong>- romaine lettuce leaves mixed with toasted bread cubes,&nbsp;<br>- grated Parmesan cheese,&nbsp;<br>- and the distinctive Caesar dressing.</div>',
                'picture' => 'image.png',
                'category' => 'food'
            ],
            [
                'name' => 'Sweet Chili Tofu',
                'modal' => '90000',
                'price' => '105000',
                'description' => '<div>It is <strong>made from</strong> a mixture of ingredients such as red chili peppers, sugar, vinegar, garlic, and fish sauce.</div>',
                'picture' => 'image.png',
                'category' => 'food'
            ],
            [
                'name' => 'Pappardelle',
                'modal' => '56000',
                'price' => '70000',
                'description' => '<div><strong>Consisting of </strong><br>- pasta made from a dough of wheat flour rolled into wide ribbons,&nbsp;<br>- served with various sauces.</div>',
                'picture' => 'image.png',
                'category' => 'food'
            ],
            [
                'name' => 'Matcha',
                'modal' => '10000',
                'price' => '15000',
                'description' => '-',
                'picture' => 'image.png',
                'category' => 'drink'
            ],
        ];

        $placeholderImage = file_get_contents(public_path('images/placeholder-menu.png'));

        foreach ($menuData as $key => $menu) {
            $filename = Str::random(40) . '.png'; 

            $imageData = $placeholderImage; 
            Storage::disk('public')->put('menu/' . $filename, $imageData); 

            $menu['picture'] = 'menu/' . $filename; 

            Menu::create($menu);
        }
    }
}





