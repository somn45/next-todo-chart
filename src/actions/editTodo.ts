"use server";

import { connectDB } from "@/libs/database";
import { type ITodo } from "@/types/schema";
import { ObjectId, WithId } from "mongodb";
import { revalidateTag } from "next/cache";

export const editTodo = async (
  { todoid, userid }: { todoid: string; userid: string },
  prevState: { message: string },
  formData: FormData,
) => {
  const willEditTodo = formData.get("todo") as string;

  const db = (await connectDB).db("next-todo-chart-cluster");
  const todoDoc = await db
    .collection<WithId<ITodo>>("todo")
    .findOne({ _id: new ObjectId(todoid) });

  // 추후에 에러 처리 과정 추가 예정
  if (!todoDoc) return { message: "" };

  await db
    .collection("todo")
    .updateOne(
      { _id: new ObjectId(todoid) },
      { $set: { textField: willEditTodo } },
    );
  revalidateTag(`todo-${todoid}`);
  revalidateTag("todos");
  return { message: "" };
};
