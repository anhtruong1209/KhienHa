<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\AdminSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSessionController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        if (! AdminSession::isAuthenticated($request)) {
            return response()->json([
                'authenticated' => false,
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return response()->json(AdminSession::sessionPayload($request));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
        ]);

        if (! AdminSession::matchesCredentials($data['username'], $data['password'])) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        AdminSession::authenticate($request, $data['username']);

        return response()->json(AdminSession::sessionPayload($request));
    }

    public function destroy(Request $request): JsonResponse
    {
        if ($request->hasSession()) {
            AdminSession::logout($request);
        }

        return response()->json([
            'authenticated' => false,
        ]);
    }
}
