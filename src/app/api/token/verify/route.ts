import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const accessToken: string = await request.json();
  const jwtSecretKey = process.env.NEXT_PUBLIC_JWT_SECRET || "";
  jwt.verify(accessToken, jwtSecretKey);
  return NextResponse.json({
    isVerify: true,
  });
}
