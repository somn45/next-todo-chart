"use server";

import { connectDB } from "@/libs/database";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

interface AccessTokenPayload {
  sub: string;
}

interface TodoDoc {
  userid: string;
  textField: string;
}

interface TodosDoc {
  author: string;
  content: TodoDoc;
}

export const addTodo = async (
  userid: string,
  prevState: { newTodo: string },
  formData: FormData,
) => {
  const newTodo = formData.get("newTodo") as string;

  const db = (await connectDB).db("next-todo-chart-cluster");
  const todo = await db
    .collection<TodoDoc>("todo")
    .insertOne({ userid, textField: newTodo });
  if (!todo) return { newTodo: "" };
  await db
    .collection<TodosDoc[]>("todos")
    .findOneAndUpdate(
      { author: userid },
      { $push: { content: todo.insertedId } },
      { upsert: true },
    );
  revalidateTag("todos");
  return { newTodo: newTodo };
};
