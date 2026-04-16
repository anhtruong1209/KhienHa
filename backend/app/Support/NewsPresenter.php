<?php

namespace App\Support;

use App\Models\News;
use Illuminate\Support\Str;

class NewsPresenter
{
    public static function toArray(News $news): array
    {
        return [
            'id' => $news->id,
            '_id' => (string) $news->id,
            'slug' => $news->slug,
            'title' => $news->title,
            'category' => $news->category,
            'excerpt' => $news->excerpt ?: Str::limit(strip_tags($news->content), 180),
            'content' => $news->content,
            'image' => MediaAssetService::toPublicUrl($news->image_path),
            'image_path' => $news->image_path,
            'date' => $news->published_at?->format('d/m/Y'),
            'published_at' => $news->published_at?->toISOString(),
            'is_featured' => $news->is_featured,
            'is_published' => $news->is_published,
        ];
    }
}
