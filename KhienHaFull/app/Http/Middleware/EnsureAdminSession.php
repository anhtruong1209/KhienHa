<?php

namespace App\Http\Middleware;

use App\Support\AdminSession;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminSession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! AdminSession::isAuthenticated($request)) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
