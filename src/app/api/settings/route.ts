import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const settings = await db.collection("settings").findOne({ key: "main" });
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("settings").updateOne(
    { key: "main" },
    { $set: body },
    { upsert: true }
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { key, value } = await req.json();
  if (!key || !value)
    return NextResponse.json(
      { success: false, error: "Missing key or value" },
      { status: 400 }
    );
  const client = await clientPromise;
  const db = client.db();
  await db.collection("settings").updateOne(
    { key: "main" },
    { $pull: { [key]: value } }
  );
  return NextResponse.json({ success: true });
}
