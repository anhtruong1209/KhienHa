<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminMediaController extends Controller
{
    public function storeImage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'max:10240'],
            'directory' => ['nullable', 'string', 'max:80'],
        ]);

        $directory = trim($data['directory'] ?? 'uploads/gallery', '/');
        $directory = preg_replace('/[^a-zA-Z0-9_\/-]/', '', $directory) ?: 'uploads/gallery';

        if (! str_starts_with($directory, 'uploads/')) {
            $directory = 'uploads/'.$directory;
        }

        $targetDirectory = public_path($directory);
        if (! is_dir($targetDirectory)) {
            mkdir($targetDirectory, 0755, true);
        }

        $file = $request->file('image');
        $extension = $file->extension() ?: $file->guessExtension() ?: 'jpg';
        $filename = now()->format('YmdHis').'-'.Str::random(10).'.'.$extension;

        $file->move($targetDirectory, $filename);

        return response()->json([
            'url' => '/'.$directory.'/'.$filename,
        ], 201);
    }
}
