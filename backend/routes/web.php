<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Khien Ha CMS API',
        'status' => 'ok',
        'docs' => [
            'public_site_content' => '/api/public/site-content',
            'public_news' => '/api/public/news',
            'public_contact' => '/api/public/contact',
            'admin_site_content' => '/api/admin/site-content',
            'admin_news' => '/api/admin/news',
            'admin_contact_messages' => '/api/admin/contact-messages',
        ],
    ]);
});
