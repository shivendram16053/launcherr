import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const publicKey = searchParams.get("publicKey") as string;

  if (!publicKey) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { publicKey },
  });

  return NextResponse.json({exists:true});
}
