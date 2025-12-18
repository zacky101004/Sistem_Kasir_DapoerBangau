<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    // CRUD menu (admin level_id 3)
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Menu $menu)
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 3) {
            abort(403);
        }

        $decorate = fn ($collection) => $collection->map(function ($item) {
            $item->picture_url = $item->picture ? url('/media/' . $item->picture) : null;
            return $item;
        });

        $fetch = fn (array $categories) => $decorate(
            $menu->whereIn('category', $categories)->latest()->get()
        );

        return response()->json([
            'makanan'       => $fetch(['makanan','food','foods']),
            'minuman'       => $fetch(['minuman','drink','drinks']),
            'paket_komplit' => $fetch(['paket_komplit','dessert','desserts','pencuci_mulut']),
        ]);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 3) {
            abort(403);
        }

        return response()->json([
            'categories' => ['makanan', 'minuman', 'paket_komplit']
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // POST /api/menus
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 3) {
            abort(403);
        }

        $validateddata = $request->validate([
           'name' => 'required|min:3',
           'modal' => 'required|regex:/([0-9]+[.,]*)+/',
           'price' => 'required|regex:/([0-9]+[.,]*)+/',
           'category' => 'required',
           'image' => 'required|image|file|max:3048',
           'description' => 'required'
        ]);

        $validateddata["modal"] = filter_var($request->modal, FILTER_SANITIZE_NUMBER_INT);
        $validateddata["price"] = filter_var($request->price, FILTER_SANITIZE_NUMBER_INT);
        // simpan ke disk public agar dapat diakses via public/storage
        $validateddata["picture"] = $request->file('image')->store('menu', 'public');

        $created = Menu::create($validateddata);
        return response()->json([
            'message' => 'New menu has been added',
            'menu' => $created
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Menu  $menu
     * @return \Illuminate\Http\Response
     */
    public function show(Menu $menu)
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 3) {
            abort(403);
        }

        $menu->diff = $menu->created_at->diffForHumans();
        $menu->picture_url = $menu->picture ? url('/media/' . $menu->picture) : null;
        return response()->json($menu);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Menu  $menu
     * @return \Illuminate\Http\Response
     */
    public function edit(Menu $menu)
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 3) {
            abort(403);
        }
        
        return response()->json([
            'menu' => $menu,
            'categories' => ['makanan', 'minuman', 'paket_komplit']
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Menu  $menu
     * @return \Illuminate\Http\Response
     */
    // PUT /api/menus/{menu}
    public function update(Request $request, Menu $menu)
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 3) {
            abort(403);
        }

        $validateddata = $request->validate([
            'name' => 'required|min:3',
            'modal' => 'required|regex:/([0-9]+[.,]*)+/',
            'price' => 'required|regex:/([0-9]+[.,]*)+/',
            'category' => 'required',
            'picture' => 'image|file|max:3048',
            'description' => 'required'
        ]);

        $validateddata["modal"] = filter_var($request->modal, FILTER_SANITIZE_NUMBER_INT);
        $validateddata["price"] = filter_var($request->price, FILTER_SANITIZE_NUMBER_INT);

        if ($request->file('picture')) {
            // hapus file lama di disk public dan simpan yang baru
            Storage::disk('public')->delete($menu->picture);
            $validateddata['picture'] = $request->file('picture')->store('menu', 'public'); 
        }

        Menu::where('id', $menu->id)
             ->update($validateddata);

        return response()->json([
            'message' => 'Menu has been updated',
            'menu' => Menu::find($menu->id)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Menu  $menu
     * @return \Illuminate\Http\Response
     */
    public function destroy(Menu $menu)
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 3) {
            abort(403);
        }

        // Hapus record beserta file pada disk public
        Storage::disk('public')->delete($menu->picture);   
        $menu->destroy($menu->id);
        return response()->json([
            'message' => 'Menu removed'
        ]);
    }

}


