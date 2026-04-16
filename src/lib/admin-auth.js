const ADMIN_SESSION_COOKIE = "kh_admin_session";
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "KhienHa@2026";
const DEFAULT_ADMIN_SECRET = "khien-ha-admin-session-secret-2026";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const encoder = new TextEncoder();

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_SECRET;
}

function normalizeCredential(value) {
  return (value || "").toString().trim();
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return diff === 0;
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function signValue(value) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getAdminSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toHex(signature);
}

export function validateAdminCredentials(username, password) {
  const normalizedUsername = normalizeCredential(username);
  const normalizedPassword = (password || "").toString();

  return constantTimeEqual(normalizedUsername, getAdminUsername())
    && constantTimeEqual(normalizedPassword, getAdminPassword());
}

export async function createAdminSessionToken(username) {
  const normalizedUsername = normalizeCredential(username) || getAdminUsername();
  const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000;
  const payload = `${normalizedUsername}|${expiresAt}`;
  const signature = await signValue(payload);

  return `${normalizedUsername}.${expiresAt}.${signature}`;
}

export async function verifyAdminSessionToken(token) {
  if (!token) return null;

  const [username, expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!username || !signature || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return null;
  }

  if (!constantTimeEqual(username, getAdminUsername())) {
    return null;
  }

  const payload = `${username}|${expiresAt}`;
  const expectedSignature = await signValue(payload);

  if (!constantTimeEqual(signature, expectedSignature)) {
    return null;
  }

  return { username, expiresAt };
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export { ADMIN_SESSION_COOKIE, DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_USERNAME };
