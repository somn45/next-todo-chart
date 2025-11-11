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
  const todo = await db
    .collection<ITodo>("todo")
    .findOne({ _id: new ObjectId(todoid) });
  if (!todo) return { message: "" };
  if (todo.state === state) return { message: "" };
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
