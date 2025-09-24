import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection("users").findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  await db.collection("users").insertOne({ 
    email, 
    password: hashed,
    primeMembership: false,
    membershipExpiresAt: null,
    membershipClaimedAt: null,
    membershipType: null
  });
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { httpOnly: true, path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
