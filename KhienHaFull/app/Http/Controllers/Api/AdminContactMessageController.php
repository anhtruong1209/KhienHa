<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminContactMessageController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            ContactMessage::query()
                ->latest()
                ->get()
                ->map(fn (ContactMessage $message): array => [
                    'id' => $message->id,
                    'name' => $message->name,
                    'phone' => $message->phone,
                    'email' => $message->email,
                    'company' => $message->company,
                    'message' => $message->message,
                    'status' => $message->status,
                    'notes' => $message->notes,
                    'created_at' => $message->created_at?->toDateTimeString(),
                ])
                ->values()
        );
    }

    public function update(Request $request, ContactMessage $contactMessage): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $contactMessage->update($data);

        return response()->json([
            'message' => 'Đã cập nhật trạng thái liên hệ.',
        ]);
    }
}
