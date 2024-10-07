/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the JSON body
    const { name, username, email, publicKey, bio, twitter, ageVerified } = body;

    // Validate required fields
    if (!name || !username || !email || !publicKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        publicKey,
        bio: bio || "",
        twitter: twitter || "",
        ageVerified: !!ageVerified,
      },
    });

    // Return successful response
    return NextResponse.json({ message: "User onboarded successfully", user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("Error onboarding user:", error);

    // Handle unique constraint violation (e.g., username, email, or public key)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Username, email, or public key already exists" }, { status: 409 });
    }

    // Return internal server error for any other issues
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
