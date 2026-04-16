import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const username = body?.username || "";
    const password = body?.password || "";

    if (!validateAdminCredentials(username, password)) {
      return NextResponse.json({ error: "Tên đăng nhập hoặc mật khẩu không đúng." }, { status: 401 });
    }

    const token = await createAdminSessionToken(username);
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Không thể đăng nhập lúc này." }, { status: 500 });
  }
}
