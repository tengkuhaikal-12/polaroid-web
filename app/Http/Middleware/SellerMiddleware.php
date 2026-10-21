<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SellerMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        abort_unless(
            in_array($request->user()?->role, ['admin', 'seller'], true),
            403,
            'Seller access required.'
        );

        return $next($request);
    }
}
