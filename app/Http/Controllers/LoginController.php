<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    // Auth session-based login/logout for API endpoints
    public function index() 
    {
        return response()->json([
            'user' => Auth::user()
        ]);
    }

    // POST /api/login
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Login berhasil',
                    'user' => Auth::user(),
                    'halaman' => 'dashboard'
                ]);
            }

            return redirect()->intended('/');
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Login gagal, periksa username atau password'
            ], 401);
        }

        return back()->with('LoginError', 'Login gagal, periksa username atau password');


    }

    // POST /api/logout
    public function logout(Request $request) 
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Berhasil keluar'
            ]);
        }

        return redirect('/login');
    }
}
