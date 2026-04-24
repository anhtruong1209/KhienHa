<?php

use App\Http\Controllers\Api\AdminContactMessageController;
use App\Http\Controllers\Api\AdminNewsController;
use App\Http\Controllers\Api\AdminSessionController;
use App\Http\Controllers\Api\AdminSiteContentController;
use Illuminate\Support\Facades\Route;

$serveFrontendOrApiInfo = function (?string $path = null) {
    if (is_string($path) && $path !== '' && str_contains($path, '.')) {
        abort(404);
    }

    $frontendIndex = base_path('public/index.html');

    if (file_exists($frontendIndex)) {
        return response()->file($frontendIndex);
    }

    // Fallback if not found
    return response()->json([
        'name' => 'Khien Ha CMS API',
        'status' => 'ok',
        'debug' => [
            'checked_path' => $frontendIndex,
            'exists' => file_exists($frontendIndex),
        ],
        'docs' => [
            'public_site_content' => '/api/public/site-content',
            'public_news' => '/api/public/news',
            'public_contact' => '/api/public/contact',
            'admin_site_content' => '/api/admin/site-content',
            'admin_news' => '/api/admin/news',
            'admin_contact_messages' => '/api/admin/contact-messages',
        ],
    ]);
};

Route::prefix('api/admin')->group(function (): void {
    Route::get('session', [AdminSessionController::class, 'show']);
    Route::post('login', [AdminSessionController::class, 'store']);
    Route::post('logout', [AdminSessionController::class, 'destroy']);

    Route::middleware('admin.session')->group(function (): void {
        Route::get('site-content', [AdminSiteContentController::class, 'show']);
        Route::put('site-content', [AdminSiteContentController::class, 'update']);
        Route::apiResource('news', AdminNewsController::class);
        Route::get('contact-messages', [AdminContactMessageController::class, 'index']);
        Route::patch('contact-messages/{contactMessage}', [AdminContactMessageController::class, 'update']);
    });
});

Route::get('/', $serveFrontendOrApiInfo);

Route::get('/{path?}', $serveFrontendOrApiInfo)
    ->where('path', '^(?!api(?:/|$)).*');
