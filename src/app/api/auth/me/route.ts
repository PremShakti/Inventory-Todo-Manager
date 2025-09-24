import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Example: Replace this with your actual authentication/session logic
function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email?: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !user.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Get user data from MongoDB, excluding password
    const userData = await db.collection("users").findOne(
      { email: user.email },
      { 
        projection: { 
          email: 1,
          primeMembership: 1,
          membershipExpiresAt: 1,
          membershipClaimedAt: 1,
          membershipType: 1,
          _id: 0 // Exclude _id field
        } 
      }
    );

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}
