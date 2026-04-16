<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        [$metadata, $encoded] = explode(',', $value, 2);

        if (! preg_match('/data:image\/(?P<extension>[^;]+);base64/', $metadata, $matches)) {
            return $value;
        }

        $extension = strtolower($matches['extension']);
        $binary = base64_decode($encoded, true);

        if ($binary === false) {
            return $value;
        }

        $path = trim($directory, '/').'/'.Str::uuid().'.'.$extension;
        Storage::disk('public')->put($path, $binary);

        return '/storage/'.$path;
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
}
