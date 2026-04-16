import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database URI not configured" }, { status: 500 });
    }
    const client = await clientPromise;
    const db = client.db("khienha");
    const news = await db.collection("news")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(news);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!clientPromise) throw new Error("Database not connected");
    const client = await clientPromise;
    const db = client.db("khienha");
    const body = await request.json();
    
    const result = await db.collection("news").insertOne({
      ...body,
      createdAt: new Date()
    });
    
    return NextResponse.json({ message: "News created", id: result.insertedId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!clientPromise) throw new Error("Database not connected");
    const client = await clientPromise;
    const db = client.db("khienha");
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    await db.collection("news").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    return NextResponse.json({ message: "News updated" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!clientPromise) throw new Error("Database not connected");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const client = await clientPromise;
    const db = client.db("khienha");
    
    await db.collection("news").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ message: "News deleted" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}
