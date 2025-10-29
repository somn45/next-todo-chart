"use server";

import { connectDB } from "@/libs/database";
import { ITodo, ITodos } from "@/types/schema";
import { WithId } from "mongodb";
import { revalidateTag } from "next/cache";

export const addTodo = async (
  userid: string,
  prevState: { newTodo: string },
  formData: FormData,
) => {
  const newTodo = formData.get("newTodo") as string;

  const db = (await connectDB).db("next-todo-chart-cluster");
  const todo = await db
    .collection<ITodo>("todo")
    .insertOne({ userid, textField: newTodo });
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
