import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const todos = await db.collection("todos").find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  // Remove any client-provided createdAt and always set it on the server
  const { createdAt, ...rest } = body;
  const newTodo = {
    ...rest,
    completed: false,
    createdAt: new Date(),
  };
  await db.collection("todos").insertOne(newTodo);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const { id, ...updateFields } = body;
  await db.collection("todos").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFields }
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id, ids } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  if (ids && Array.isArray(ids)) {
    await db.collection("todos").deleteMany({ _id: { $in: ids.map((id: string) => new ObjectId(id)) } });
  } else if (id) {
    await db.collection("todos").deleteOne({ _id: new ObjectId(id) });
  }
  return NextResponse.json({ success: true });
}
