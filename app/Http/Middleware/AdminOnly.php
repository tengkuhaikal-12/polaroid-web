<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is logged in and matches your specific email
        if ($request->user() && $request->user()->email === 'haikaltengku1741@gmail.com') {
            return $next($request);
        }

        // Otherwise, abort with 403 Forbidden or redirect home
        abort(403, 'Unauthorized action.');
    }
}