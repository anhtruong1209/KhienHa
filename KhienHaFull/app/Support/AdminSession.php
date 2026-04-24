<?php

namespace App\Support;

use Illuminate\Http\Request;

class AdminSession
{
    public const AUTHENTICATED_KEY = 'kh_admin_authenticated';

    public const IDENTIFIER_KEY = 'kh_admin_identifier';

    public static function matchesCredentials(?string $identifier, ?string $password): bool
    {
        $normalizedIdentifier = self::normalizeIdentifier($identifier);
        $expectedPassword = self::adminPassword();
        $providedPassword = (string) ($password ?? '');

        if (! hash_equals($expectedPassword, $providedPassword)) {
            return false;
        }

        foreach (self::allowedIdentifiers() as $allowedIdentifier) {
            if (hash_equals($allowedIdentifier, $normalizedIdentifier)) {
                return true;
            }
        }

        return false;
    }

    public static function authenticate(Request $request, ?string $identifier = null): void
    {
        $request->session()->put(self::AUTHENTICATED_KEY, true);
        $request->session()->put(self::IDENTIFIER_KEY, self::displayIdentifier($identifier));
        $request->session()->migrate(true);
    }

    public static function logout(Request $request): void
    {
        $request->session()->forget([
            self::AUTHENTICATED_KEY,
            self::IDENTIFIER_KEY,
        ]);
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    public static function isAuthenticated(Request $request): bool
    {
        return (bool) $request->session()->get(self::AUTHENTICATED_KEY, false);
    }

    public static function sessionPayload(Request $request): array
    {
        return [
            'authenticated' => self::isAuthenticated($request),
            'identifier' => $request->session()->get(self::IDENTIFIER_KEY, self::displayIdentifier()),
        ];
    }

    public static function displayIdentifier(?string $identifier = null): string
    {
        $normalizedIdentifier = self::normalizeIdentifier($identifier);

        foreach (self::allowedIdentifiers() as $allowedIdentifier) {
            if ($normalizedIdentifier !== '' && hash_equals($allowedIdentifier, $normalizedIdentifier)) {
                return $allowedIdentifier;
            }
        }

        return self::allowedIdentifiers()[0] ?? 'admin';
    }

    public static function normalizeIdentifier(?string $identifier): string
    {
        return strtolower(trim((string) ($identifier ?? '')));
    }

    /**
     * @return list<string>
     */
    private static function allowedIdentifiers(): array
    {
        $identifiers = [];

        $adminUsername = trim((string) env('ADMIN_USERNAME', ''));
        $adminEmail = trim((string) env('ADMIN_EMAIL', 'admin@khienha.vn'));

        if ($adminUsername !== '') {
            $identifiers[] = strtolower($adminUsername);
        }

        if ($adminEmail !== '') {
            $identifiers[] = strtolower($adminEmail);

            if (str_contains($adminEmail, '@')) {
                $identifiers[] = strtolower((string) strstr($adminEmail, '@', true));
            }
        }

        if ($identifiers === []) {
            $identifiers[] = 'admin';
        }

        return array_values(array_unique(array_filter($identifiers)));
    }

    private static function adminPassword(): string
    {
        return (string) env('ADMIN_PASSWORD', 'KhienHa@123456');
    }
}
