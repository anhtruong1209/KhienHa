<?php

use App\Http\Controllers\Api\AdminContactMessageController;
use App\Http\Controllers\Api\AdminNewsController;
use App\Http\Controllers\Api\AdminSiteContentController;
use App\Http\Controllers\Api\PublicContentController;
use Illuminate\Support\Facades\Route;

Route::prefix('public')->group(function (): void {
    Route::get('site-content', [PublicContentController::class, 'siteContent']);
    Route::get('news', [PublicContentController::class, 'news']);
    Route::get('news/{identifier}', [PublicContentController::class, 'showNews']);
    Route::post('contact', [PublicContentController::class, 'storeContact']);
});

Route::prefix('admin')->group(function (): void {
    Route::get('site-content', [AdminSiteContentController::class, 'show']);
    Route::put('site-content', [AdminSiteContentController::class, 'update']);
    Route::apiResource('news', AdminNewsController::class);
    Route::get('contact-messages', [AdminContactMessageController::class, 'index']);
    Route::patch('contact-messages/{contactMessage}', [AdminContactMessageController::class, 'update']);
});
