import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
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

export async function POST(req: NextRequest) {
  const email = getUserEmailFromRequest(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db();

    // Check if user exists and get their current membership status
    const user = await db.collection("users").findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has prime membership
    if (user.primeMembership === true) {
      return NextResponse.json({ 
        success: false, 
        message: "You already have prime membership!" 
      });
    }

    // Calculate expiration date (6 months from now)
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6);

    // Update user with prime membership
    await db.collection("users").updateOne(
      { email },
      { 
        $set: { 
          primeMembership: true,
          membershipClaimedAt: new Date(),
          membershipExpiresAt: expirationDate,
          membershipType: "durga-puja-offer"
        }
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Congratulations! Prime membership activated successfully!" 
    });

  } catch (error) {
    console.error("Error claiming membership:", error);
    return NextResponse.json({ 
      error: "Failed to claim membership" 
    }, { status: 500 });
  }
}
