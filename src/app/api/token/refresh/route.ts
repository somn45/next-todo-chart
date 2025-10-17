import { connectDB } from "@/libs/database";
import { WithId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface User {
  userid: string;
  password: string;
  email: string;
  refreshToken: string;
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<{ refreshToken?: string }>> {
  const userid = request.nextUrl.searchParams.get("userid");

  if (!userid) return NextResponse.json({ refreshToken: undefined });

  const db = (await connectDB).db("next-todo-chart-cluster");
  const user = await db.collection<WithId<User>>("users").findOne({ userid });
  return NextResponse.json({ refreshToken: user?.refreshToken });
}
