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
  
  // Validate image size if present (optional)
  if (body.image) {
    const imageSizeKB = (body.image.length * 0.75) / 1024;
    if (imageSizeKB > 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 1MB" },
        { status: 400 }
      );
    }
    
    // Validate base64 format
    if (!body.image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: "Invalid image format. Must be base64 encoded image." },
        { status: 400 }
      );
    }
  }

  const client = await clientPromise;
  const db = client.db();
  
  const todoData: any = {
    ...body,
    email,
    completed: false,
    createdAt: new Date(),
    date: new Date().toISOString().split("T")[0],
  };
  
  // Only add image field if it exists
  if (body.image) {
    todoData.image = body.image;
  }

  const result = await db.collection("todos").insertOne(todoData);
  return NextResponse.json({ success: true, id: result.insertedId });
}

export async function PUT(req: NextRequest) {
  const email = getUserEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...updateData } = body;
  
  // Validate image size if present (optional)
  if (updateData.image !== undefined && updateData.image) {
    const imageSizeKB = (updateData.image.length * 0.75) / 1024;
    if (imageSizeKB > 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 1MB" },
        { status: 400 }
      );
    }
    
    // Validate base64 format
    if (!updateData.image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: "Invalid image format. Must be base64 encoded image." },
        { status: 400 }
      );
    }
  }

  const client = await clientPromise;
  const db = client.db();
  await db.collection("todos").updateOne(
    { _id: new ObjectId(id), email },
    { $set: updateData }
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
