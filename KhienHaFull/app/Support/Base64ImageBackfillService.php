<?php

namespace App\Support;

use App\Models\News;
use App\Models\SiteContent;

class Base64ImageBackfillService
{
    public function run(): array
    {
        return [
            'site_content' => $this->backfillSiteContent(),
            'news' => $this->backfillNews(),
        ];
    }

    private function backfillSiteContent(): array
    {
        $content = SiteContent::query()->where('key', 'homepage')->first();
        if (! $content) {
            return [
                'found' => false,
                'converted' => 0,
                'unchanged' => 0,
            ];
        }

        $payload = $content->payload ?? [];
        $converted = 0;
        $unchanged = 0;

        $payload['banners'] = collect($payload['banners'] ?? [])
            ->map(function ($item) use (&$converted, &$unchanged) {
                return $this->convertValue($item, $converted, $unchanged);
            })
            ->all();

        if (isset($payload['about']['image'])) {
            $payload['about']['image'] = $this->convertValue($payload['about']['image'], $converted, $unchanged);
        }

        if (isset($payload['quality']['image'])) {
            $payload['quality']['image'] = $this->convertValue($payload['quality']['image'], $converted, $unchanged);
        }

        if (isset($payload['quality']['mainImage'])) {
            $payload['quality']['mainImage'] = $this->convertValue($payload['quality']['mainImage'], $converted, $unchanged);
        }

        $payload['capacity'] = collect($payload['capacity'] ?? [])
            ->map(function (array $item) use (&$converted, &$unchanged): array {
                if (isset($item['image'])) {
                    $item['image'] = $this->convertValue($item['image'], $converted, $unchanged);
                }

                return $item;
            })
            ->all();

        $payload['gallery'] = collect($payload['gallery'] ?? [])
            ->map(function (array $item) use (&$converted, &$unchanged): array {
                if (isset($item['url'])) {
                    $item['url'] = $this->convertValue($item['url'], $converted, $unchanged);
                }

                return $item;
            })
            ->all();

        $content->update(['payload' => $payload]);

        return [
            'found' => true,
            'converted' => $converted,
            'unchanged' => $unchanged,
        ];
    }

    private function backfillNews(): array
    {
        $converted = 0;
        $unchanged = 0;
        $total = 0;

        News::query()->chunkById(50, function ($items) use (&$converted, &$unchanged, &$total): void {
            foreach ($items as $news) {
                $total++;
                $nextValue = $this->convertValue($news->image_path, $converted, $unchanged);

                if ($nextValue !== $news->image_path) {
                    $news->update(['image_path' => $nextValue]);
                }
            }
        });

        return [
            'total' => $total,
            'converted' => $converted,
            'unchanged' => $unchanged,
        ];
    }

    private function convertValue(?string $value, int &$converted, int &$unchanged): ?string
    {
        if (! is_string($value) || $value === '') {
            $unchanged++;

            return $value;
        }

        $nextValue = MediaAssetService::toDataUri($value);

        if ($nextValue !== $value) {
            $converted++;

            return $nextValue;
        }

        $unchanged++;

        return $value;
    }
}
