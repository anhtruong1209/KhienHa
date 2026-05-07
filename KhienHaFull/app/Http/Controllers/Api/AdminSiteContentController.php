<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Support\DefaultSiteContent;
use App\Support\MediaAssetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminSiteContentController extends Controller
{
    public function show(): JsonResponse
    {
        $content = SiteContent::query()->firstOrCreate(
            ['key' => 'homepage'],
            ['payload' => DefaultSiteContent::make()]
        );

        return response()->json($content->payload);
    }

    public function update(Request $request): JsonResponse
    {
        $payload = $this->normalizePayload($request->all());

        $content = SiteContent::query()->updateOrCreate(
            ['key' => 'homepage'],
            ['payload' => $payload]
        );

        return response()->json($content->payload);
    }

    private function normalizePayload(array $payload): array
    {
        $payload['banners'] = collect($payload['banners'] ?? [])
            ->filter()
            ->map(fn ($item) => MediaAssetService::persistImage($item, 'uploads/banners'))
            ->values()
            ->all();

        $payload['about'] = $payload['about'] ?? [];
        $aboutVideoUrls = collect(data_get($payload, 'about.videoUrls', []))
            ->push(data_get($payload, 'about.videoUrl'))
            ->map(fn ($url) => is_string($url) ? trim($url) : '')
            ->filter()
            ->unique()
            ->values()
            ->all();

        $payload['about']['videoUrls'] = $aboutVideoUrls;
        $payload['about']['videoUrl'] = $aboutVideoUrls[0] ?? '';
        $payload['about']['image'] = MediaAssetService::persistImage(
            data_get($payload, 'about.image'),
            'uploads/about'
        );

        $qualityImage = MediaAssetService::persistImage(
            data_get($payload, 'quality.mainImage', data_get($payload, 'quality.image')),
            'uploads/quality'
        );

        if ($qualityImage) {
            $payload['quality']['image'] = $qualityImage;
            $payload['quality']['mainImage'] = $qualityImage;
        }

        $payload['capacity'] = collect($payload['capacity'] ?? [])
            ->map(function (array $item): array {
                $item['image'] = MediaAssetService::persistImage($item['image'] ?? null, 'uploads/capacity');

                return $item;
            })
            ->values()
            ->all();

        $payload['gallery'] = collect($payload['gallery'] ?? [])
            ->map(function (array $item): array {
                $coverImage = MediaAssetService::persistImage($item['url'] ?? null, 'uploads/gallery');
                $images = collect($item['images'] ?? [])
                    ->filter()
                    ->map(fn ($image) => MediaAssetService::persistImage($image, 'uploads/gallery'))
                    ->filter()
                    ->values()
                    ->all();

                if ($coverImage && ! in_array($coverImage, $images, true)) {
                    array_unshift($images, $coverImage);
                }

                $item['images'] = $images;
                $item['url'] = $images[0] ?? $coverImage;
                $item['slug'] = Str::slug($item['slug'] ?? $item['title'] ?? 'gallery') ?: 'gallery';
                $item['category'] = $item['category'] ?? 'Thư viện';
                $item['categorySlug'] = Str::slug($item['category']) ?: 'thu-vien';

                return $item;
            })
            ->values()
            ->all();

        return $payload;
    }
}
