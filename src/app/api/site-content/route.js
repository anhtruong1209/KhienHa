import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function hasAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);

  return Boolean(session);
}

export async function GET() {
  try {
    const db = client.db("khienha");
    const content = await db.collection("site_content").findOne({ type: "main" });

    return NextResponse.json(content || {});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = client.db("khienha");
    const body = await request.json();

    // Using upsert to keep a single "main" content document
    await db.collection("site_content").updateOne(
      { type: "main" },
      { $set: { ...body, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Content updated successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
