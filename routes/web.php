<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::prefix('api')->group(function () {
    Route::post('/login', [LoginController::class, 'authenticate'])->name('login');
    Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth');

    Route::middleware('auth')->group(function () {
        Route::get('/me', function () {
            return response()->json(['user' => Auth::user()]);
        });
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/reports', [ReportController::class, 'index']);
    });

    Route::middleware(['auth', 'checkLevel:3'])->group(function () {
        Route::get('/menus', [MenuController::class, 'index']);
        Route::post('/menus', [MenuController::class, 'store']);
        Route::get('/menus/create', [MenuController::class, 'create']);
        Route::get('/menus/{menu}', [MenuController::class, 'show']);
        Route::put('/menus/{menu}', [MenuController::class, 'update']);
        Route::delete('/menus/{menu}', [MenuController::class, 'destroy']);

        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/create', [UserController::class, 'create']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::post('/users/{user}/profile', [UserController::class, 'updateProfile']);
        Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword']);
    });

    Route::middleware(['auth', 'checkLevel:2,3'])->group(function () {
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::post('/transactions', [TransactionController::class, 'store']);
        Route::get('/transactions/create', [TransactionController::class, 'create']);
        Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);
        Route::put('/transactions/{transaction}', [TransactionController::class, 'update']);
    });

    Route::get('/invoice/{transaction}', function (Transaction $transaction) {
        return response()->json([
            'data' => $transaction->with(['transaction_details', 'transaction_details.menu', 'user'])->where('id', $transaction->id)->get()
        ]);
    })->middleware('auth');
});

Route::get('/invoice/{transaction}/print', function (Transaction $transaction) {
    $data = $transaction->with(['transaction_details', 'transaction_details.menu', 'user'])->find($transaction->id);
    if (!$data) {
        abort(404);
    }
    return view('invoice', ['data' => $data]);
})->middleware('auth');

Route::get('/media/{path}', function ($path) {
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }
    return Storage::disk('public')->response($path);
})->where('path', '.*');

Route::view('/{any}', 'app')->where('any', '.*');
