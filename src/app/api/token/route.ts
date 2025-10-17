import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const userid: string = await request.json();
  const jwtSecretKey = process.env.NEXT_PUBLIC_JWT_SECRET || "";
  const accessToken = jwt.sign({ id: userid }, jwtSecretKey, {
    expiresIn: "1h",
    subject: userid,
  });
  const refreshToken = jwt.sign({ id: userid }, jwtSecretKey, {
    expiresIn: "7 days",
  });
  return NextResponse.json({
    accessToken,
    refreshToken,
  });
}
