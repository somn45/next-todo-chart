import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<{ accessToken: string; refreshToken: string }>> {
  const userid: string = await request.json();

  const jwtSecretKey = process.env.JWT_SECRET;
  if (!jwtSecretKey) {
    throw new Error("No secret key");
  }

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
