<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Support\MediaAssetService;
use App\Support\NewsPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminNewsController extends Controller
{
    public function index(): JsonResponse
    {
        $items = News::query()
            ->orderByDesc('published_at')
            ->get()
            ->map(fn (News $news): array => NewsPresenter::toArray($news))
            ->values();

        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $news = News::query()->create($this->payload($request));

        return response()->json(NewsPresenter::toArray($news), 201);
    }

    public function show(News $news): JsonResponse
    {
        return response()->json(NewsPresenter::toArray($news));
    }

    public function update(Request $request, News $news): JsonResponse
    {
        $news->update($this->payload($request, $news));

        return response()->json(NewsPresenter::toArray($news->fresh()));
    }

    public function destroy(News $news): JsonResponse
    {
        $news->delete();

        return response()->json(['message' => 'Đã xóa tin tức.']);
    }

    private function payload(Request $request, ?News $existing = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:120'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'image' => ['nullable', 'string'],
            'date' => ['nullable', 'string'],
            'published_at' => ['nullable', 'date'],
            'is_featured' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        return [
            'title' => $data['title'],
            'slug' => $this->uniqueSlug($data['slug'] ?? $data['title'], $existing?->id),
            'category' => $data['category'] ?? 'Tin hoạt động',
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'],
            'image_path' => MediaAssetService::persistImage($data['image'] ?? null, 'uploads/news') ?? $existing?->image_path,
            'published_at' => $data['published_at'] ?? $this->normalizeDate($data['date'] ?? null),
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'is_published' => (bool) ($data['is_published'] ?? true),
        ];
    }

    private function uniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($source) ?: 'tin-tuc';
        $slug = $baseSlug;
        $index = 1;

        while (
            News::query()
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $baseSlug.'-'.$index;
            $index++;
        }

        return $slug;
    }

    private function normalizeDate(?string $date): string
    {
        if (! $date) {
            return now()->toDateTimeString();
        }

        if (preg_match('/^(?<day>\d{1,2})\/(?<month>\d{1,2})\/(?<year>\d{4})$/', $date, $matches)) {
            return sprintf(
                '%04d-%02d-%02d 08:00:00',
                $matches['year'],
                $matches['month'],
                $matches['day']
            );
        }

        return now()->toDateTimeString();
    }
}
