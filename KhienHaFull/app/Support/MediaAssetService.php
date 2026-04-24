<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;

class MediaAssetService
{
    public static function persistImage(?string $value, string $directory): ?string
    {
        if (! is_string($value) || $value === '') {
            return $value;
        }

        if (! str_starts_with($value, 'data:image')) {
            return $value;
        }
        
        // The project now stores uploaded images directly as base64 in the database.
        return $value;
    }

    public static function toPublicUrl(?string $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return $value;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, 'data:')) {
            return $value;
        }

        return rtrim(config('app.url'), '/').'/'.ltrim($value, '/');
    }

    public static function toDataUri(?string $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return $value;
        }

        if (str_starts_with($value, 'data:image')) {
            return $value;
        }

        $localPath = self::resolveLocalPath($value);
        if ($localPath && is_file($localPath)) {
            $binary = @file_get_contents($localPath);
            $mimeType = self::detectMimeType($localPath);

            if ($binary !== false && $mimeType) {
                return 'data:'.$mimeType.';base64,'.base64_encode($binary);
            }
        }

        $url = self::resolveUrl($value);
        if (! $url) {
            return $value;
        }

        try {
            $response = Http::withOptions(['verify' => false])->timeout(20)->retry(1, 300)->get($url);
            if (! $response->successful()) {
                return $value;
            }

            $mimeType = trim(explode(';', $response->header('Content-Type', ''), 2)[0]);
            if ($mimeType === '') {
                $mimeType = self::detectMimeType($url);
            }

            if ($mimeType === '') {
                return $value;
            }

            return 'data:'.$mimeType.';base64,'.base64_encode($response->body());
        } catch (\Throwable) {
            return $value;
        }
    }

    private static function resolveLocalPath(string $value): ?string
    {
        $normalized = '/'.ltrim($value, '/');

        if (str_starts_with($normalized, '/storage/')) {
            return storage_path('app/public/'.ltrim(substr($normalized, strlen('/storage/')), '/'));
        }

        $publicPath = public_path(ltrim($value, '/'));
        if (is_file($publicPath)) {
            return $publicPath;
        }

        return null;
    }

    private static function resolveUrl(string $value): ?string
    {
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        if (str_starts_with($value, '/')) {
            return rtrim(config('app.url'), '/').$value;
        }

        if (str_starts_with($value, 'storage/') || str_starts_with($value, 'uploads/')) {
            return rtrim(config('app.url'), '/').'/'.$value;
        }

        return null;
    }

    private static function detectMimeType(string $path): string
    {
        $detected = @mime_content_type($path);
        if (is_string($detected) && $detected !== '') {
            return $detected;
        }

        return match (strtolower(pathinfo(parse_url($path, PHP_URL_PATH) ?: $path, PATHINFO_EXTENSION))) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'bmp' => 'image/bmp',
            default => '',
        };
    }
}
