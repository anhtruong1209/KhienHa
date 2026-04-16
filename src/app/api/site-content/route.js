import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database URI not configured" }, { status: 500 });
    }
    const client = await clientPromise;
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
    if (!clientPromise) throw new Error("Database not connected");
    const client = await clientPromise;
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
