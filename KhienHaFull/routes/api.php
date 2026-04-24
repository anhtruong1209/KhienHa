<?php

use App\Http\Controllers\Api\AdminContactMessageController;
use App\Http\Controllers\Api\AdminNewsController;
use App\Http\Controllers\Api\AdminSessionController;
use App\Http\Controllers\Api\AdminSiteContentController;
use App\Http\Controllers\Api\PublicContentController;
use Illuminate\Support\Facades\Route;

Route::prefix('public')->group(function (): void {
    Route::get('site-content', [PublicContentController::class, 'siteContent']);
    Route::get('news', [PublicContentController::class, 'news']);
    Route::get('news/{identifier}', [PublicContentController::class, 'showNews']);
    Route::post('contact', [PublicContentController::class, 'storeContact']);
});
