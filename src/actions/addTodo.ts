"use server";

import { connectDB } from "@/libs/database";
import { ITodo, ITodos } from "@/types/schema";
import { WithId } from "mongodb";
import { revalidateTag } from "next/cache";

const AFTER_NINE_HOUR = 1000 * 60 * 60 * 9;

export const addTodo = async (
  userid: string,
  prevState: { newTodo: string },
  formData: FormData,
) => {
  const newTodo = formData.get("newTodo") as string;

  const db = (await connectDB).db("next-todo-chart-cluster");
  const todo = await db.collection("todo").insertOne({
    userid,
    textField: newTodo,
    state: "할 일",
    createdAt: new Date(Date.now() + AFTER_NINE_HOUR),
    updatedAt: new Date(Date.now() + AFTER_NINE_HOUR),
  });
  if (!todo) return { newTodo: "" };
  await db
    .collection<WithId<ITodos>>("todos")
    .findOneAndUpdate(
      { author: userid },
      { $push: { content: todo.insertedId } },
      { upsert: true },
    );
  revalidateTag("todos");
  return { newTodo: newTodo };
};
