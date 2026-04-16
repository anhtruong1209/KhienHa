<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactMessageRequest;
use App\Models\ContactMessage;
use App\Models\News;
use App\Models\SiteContent;
use App\Support\DefaultSiteContent;
use App\Support\NewsPresenter;
use Illuminate\Http\JsonResponse;

class PublicContentController extends Controller
{
    public function siteContent(): JsonResponse
    {
        $content = SiteContent::query()->firstOrCreate(
            ['key' => 'homepage'],
            ['payload' => DefaultSiteContent::make()]
        );

        return response()->json($content->payload);
    }

    public function news(): JsonResponse
    {
        $items = News::query()
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->get()
            ->map(fn (News $news): array => NewsPresenter::toArray($news))
            ->values();

        return response()->json($items);
    }

    public function showNews(string $identifier): JsonResponse
    {
        $news = News::query()
            ->where('slug', $identifier)
            ->orWhere('id', $identifier)
            ->firstOrFail();

        return response()->json(NewsPresenter::toArray($news));
    }

    public function storeContact(ContactMessageRequest $request): JsonResponse
    {
        ContactMessage::query()->create([
            ...$request->validated(),
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Đã nhận yêu cầu tư vấn. Khiên Hà sẽ liên hệ lại trong thời gian sớm nhất.',
        ], 201);
    }
}
