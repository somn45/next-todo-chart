"use server";

import { connectDB } from "@/libs/database";
import { type ITodo } from "@/types/schema";
import { ObjectId, WithId } from "mongodb";
import { revalidateTag } from "next/cache";

const AFTER_NINE_HOUR = 1000 * 60 * 60 * 9;

export const editTodo = async (
  { todoid, userid }: { todoid: string; userid: string },
  prevState: { message: string },
  formData: FormData,
) => {
  const willEditTodo = formData.get("todo") as string;

  try {
    const db = (await connectDB).db("next-todo-chart-cluster");
    const todoDoc = await db
      .collection<WithId<ITodo>>("todo")
      .findOne({ _id: new ObjectId(todoid) });

    if (!todoDoc) {
      return { message: "조회 결과 해당 투두가 없습니다." };
    }
    if (willEditTodo === todoDoc.textField) {
      return { message: "이전에 작성한 내용과 동일합니다." };
    }

    await db.collection("todo").updateOne(
      { _id: new ObjectId(todoid) },
      {
        $set: {
          textField: willEditTodo,
          updatedAt: new Date(Date.now() + AFTER_NINE_HOUR),
        },
      },
    );
    revalidateTag(`todo-${todoid}`);
    revalidateTag("todos");
    return { message: "" };
  } catch (error) {
    console.error(error);
    return { message: "" };
  }
};
