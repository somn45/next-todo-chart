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

    const todosDoc = await db.collection("todos").find().toArray();
    const todoDoc = await db.collection("todo").find().toArray();
    if (todosDoc.length !== 0 || todoDoc.length !== 0)
      throw new Error("모든 투두 삭제 실패");
    return NextResponse.json({ message: "모든 투두 삭제 완료" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "모든 투두 삭제 실패" },
      { status: 500 },
    );
  }
}
