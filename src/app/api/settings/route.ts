import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const settings = await db.collection("settings").findOne({ email });
  return NextResponse.json(settings || {});
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, inventoryTypes, locations, descriptions } = body;
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();

  // Fetch existing settings for this user
  const existing = await db.collection("settings").findOne({ email });

  // Merge: keep existing keys unless new ones are provided
  const update: any = {
    inventoryTypes: inventoryTypes ?? existing?.inventoryTypes ?? [],
    locations: locations ?? existing?.locations ?? [],
    descriptions: descriptions ?? existing?.descriptions ?? [],
    email,
  };

  await db.collection("settings").updateOne(
    { email },
    { $set: update },
    { upsert: true }
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { key, value, email } = await req.json();
  if (!key || !value || !email)
    return NextResponse.json(
      { success: false, error: "Missing key, value, or email" },
      { status: 400 }
    );
  const client = await clientPromise;
  const db = client.db();
  await db.collection("settings").updateOne(
    { email },
    { $pull: { [key]: value } }
  );
  return NextResponse.json({ success: true });
}
