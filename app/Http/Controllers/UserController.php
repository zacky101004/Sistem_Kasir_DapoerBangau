<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 3) {
            abort(403);
        }

        return response()->json([
            'users' => User::with('level')->get(),
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
            'levels' => [1,2,3]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 3) {
            abort(403);
        }

        Validator::extend('without_spaces', function ($attr, $value) {
            return preg_match('/^\S*$/u', $value);
        });
        $validateddata = $request->validate([
            'level_id' => 'required',
            'name' => 'required|min:3',
            'username' => 'required|min:3|unique:users|without_spaces',
            'password' => 'required|min:5',
        ], [
            'without_spaces' => 'The username cannot contain space'
        ]);
        $validateddata['password'] = bcrypt($request->password);

        User::create($validateddata);

        return response()->json([
            'message' => 'New employee has been added',
            'user' => User::where('username', $request->username)->first()
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $authUser = Auth::user();

        if (!$authUser || $authUser->level_id !== 3) {
            abort(403);
        }

        return response()->json([
            'user' => $user
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        $authUser = Auth::user();

        if (!$authUser || $authUser->level_id !== 3) {
            abort(403);
        }

        return response()->json([
            'user' => $user
        ]);
    }

    // PUT /api/users/{user}
    public function update(Request $request, User $user)
    {
        $authUser = Auth::user();

        if (!$authUser || $authUser->level_id !== 3) {
            abort(403);
        }

        Validator::extend('without_spaces', function ($attr, $value) {
            return preg_match('/^\S*$/u', $value);
        });

        $validateddata = $request->validate([
            'level_id' => 'required',
            'name' => 'required|min:3',
            'username' => 'required|min:3|unique:users,username,' . $user->id . '|without_spaces|',
        ], [
            'without_spaces' => 'The username cannot contain space'
        ]);

        User::where('id', $user->id)
            ->update($validateddata);
        return response()->json([
            'message' => 'Employee has been updated',
            'user' => User::find($user->id)
        ]);
    }

    // DELETE /api/users/{user}
    public function destroy(Request $request, User $user)
    {
        $authUser = Auth::user();

        if (!$authUser || $authUser->level_id !== 3) {
            abort(403);
        }

        $user_id = $request->users;
        for ($i = 0; $i < count($user_id); $i++) {
            $user->destroy($user_id[$i]);
        };
        return response()->json([
            'message' => 'Selected employees removed'
        ]);
    }

    // POST /api/users/{user}/profile
    public function updateProfile(Request $request, User $user)
    {
        $authUser = Auth::user();

        if (!$authUser || $authUser->level_id !== 3) {
            abort(403);
        }

        Validator::extend('without_spaces', function ($attr, $value) {
            return preg_match('/^\S*$/u', $value);
        });

        $validateddata = $request->validate([
            'name' => 'required|min:3',
            'username' => 'required|min:3|unique:users,username,' . $user->id . '|without_spaces|',
        ], [
            'without_spaces' => 'The username cannot contain space'
        ]);

        User::where('id', $user->id)
            ->update($validateddata);

        return response()->json([
            'message' => 'Profile updated',
            'user' => User::find($user->id)
        ]);
    }

    public function resetPassword(Request $request, User $user)
    {
        $authUser = Auth::user();

        if (!$authUser || $authUser->level_id !== 3) {
            abort(403);
        }

        $request->validate([
            'password' => 'required|min:6|confirmed',
        ]);

        $user->update([
            'password' => bcrypt($request->password),
        ]);

        return response()->json([
            'message' => 'Password berhasil diubah.'
        ]);
    }
}
