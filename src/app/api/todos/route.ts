import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function getUserEmailFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded.email;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const email = getUserEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();

  // --- Filtering logic ---
  const { searchParams } = new URL(req.url);
  const modalName = searchParams.get("modalName");
  // Change to support date range
  const createdAtStart = searchParams.get("createdAtStart");
  const createdAtEnd = searchParams.get("createdAtEnd");

  const query: any = { email };

  if (modalName) {
    query.modalName = { $regex: modalName, $options: "i" };
  }

  if (createdAtStart || createdAtEnd) {
    query.createdAt = {};
    if (createdAtStart) {
      query.createdAt.$gte = new Date(createdAtStart);
    }
    if (createdAtEnd) {
      // Add 1 day to include the end date fully
      const end = new Date(createdAtEnd);
      end.setDate(end.getDate() + 1);
      query.createdAt.$lt = end;
    }
  }

  const todos = await db.collection("todos").find(query).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const email = getUserEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const { createdAt, ...rest } = body;
  const newTodo = {
    ...rest,
    email,
    completed: false,
    createdAt: new Date(),
  };
  await db.collection("todos").insertOne(newTodo);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const email = getUserEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const { id, ...updateFields } = body;
  await db.collection("todos").updateOne(
    { _id: new ObjectId(id), email },
    { $set: updateFields }
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const email = getUserEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ids } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  if (ids && Array.isArray(ids)) {
    await db.collection("todos").deleteMany({ _id: { $in: ids.map((id: string) => new ObjectId(id)) }, email });
  } else if (id) {
    await db.collection("todos").deleteOne({ _id: new ObjectId(id), email });
  }
  return NextResponse.json({ success: true });
}
