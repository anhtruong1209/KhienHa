<?php

namespace App\Support;

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
}
