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

export async function DELETE(request: NextRequest) {
  const userid = await request.json();

  if (!userid)
    return NextResponse.json(
      {
        errorMessage: "해당 사용자는 가입되어 있지 않습니다.",
      },
      { status: 404 },
    );
  const db = (await connectDB).db("next-todo-chart-cluster");
  const deletedRefreshToken = await db
    .collection("user")
    .updateOne({ userid }, { $unset: { refreshToken: "" } });
  return NextResponse.json({
    deletedRefreshToken,
  });
}
