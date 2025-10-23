"use server";

import { connectDB } from "@/libs/database";
import { ObjectId } from "mongodb";
import { cookies, headers } from "next/headers";

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
  prevState: { newTodo: string },
  formData: FormData,
) => {
  const newTodo = formData.get("newTodo") as string;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");
  if (!accessToken) return { newTodo: "" };
  const { sub: userid }: AccessTokenPayload = JSON.parse(
    atob(accessToken.value.split(".")[1]),
  );

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
  return { newTodo: newTodo };
};
