"use server";

import { connectDB } from "@/libs/database";
import { ITodo } from "@/types/schema";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";

const AFTER_NINE_HOUR = 1000 * 60 * 60 * 9;

export const updateTodoState = async (
  { todoid }: { todoid: string },
  prevState: { message: string },
  formData: FormData,
) => {
  const state = formData.get("state");

  const db = (await connectDB).db("next-todo-chart-cluster");
  const todoDoc = await db
    .collection<ITodo>("todo")
    .findOne({ _id: new ObjectId(todoid) });

  if (!todoDoc) return { message: "조회 결과 해당 투두가 없습니다." };
  if (todoDoc.state === state)
    return { message: "할 일의 상태가 이전과 다르지 않습니다." };
  db.collection("todo").updateOne(
    { _id: new ObjectId(todoid) },
    {
      $set: {
        state,
        updatedAt: new Date(Date.now() + AFTER_NINE_HOUR),
      },
    },
  );

  revalidateTag(`todo-${todoid}`);
  revalidateTag("todos");
  return { message: "" };
};
