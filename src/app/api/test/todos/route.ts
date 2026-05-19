export const dynamic = "force-dynamic";

import { connectDB } from "@/libs/database";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    if (process.env.APP_ENV !== "test")
      return NextResponse.json({
        message: "테스트 환경에서 실행 부탁드립니다.",
      });
    const db = (await connectDB).db();
    await db.collection("todos").deleteMany({});
    await db.collection("todo").deleteMany({});
    return NextResponse.json({ message: "모든 투두 삭제 완료" });
  } catch (error) {
    console.error(error);
  }
}
