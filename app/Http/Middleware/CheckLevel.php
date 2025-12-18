<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckLevel
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  mixed ...$levels
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$levels)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $userLevel = Auth::user()->level_id;

        if (!in_array($userLevel, $levels)) {
            abort(403);
        }

        return $next($request);
    }
}
