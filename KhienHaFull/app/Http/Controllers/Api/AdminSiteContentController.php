<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Support\DefaultSiteContent;
use App\Support\MediaAssetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
                $item['url'] = MediaAssetService::persistImage($item['url'] ?? null, 'uploads/gallery');

                return $item;
            })
            ->values()
            ->all();

        return $payload;
    }
}
