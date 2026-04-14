import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("khienha");
    const content = await db.collection("settings").findOne({ key: "site_content" });
    
    return NextResponse.json(content?.data || {});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("khienha");
    const body = await request.json();
    
    await db.collection("settings").updateOne(
      { key: "site_content" },
      { $set: { data: body, updatedAt: new Date() } },
      { upsert: true }
    );
    
    return NextResponse.json({ message: "Content updated successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
