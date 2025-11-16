"use server";

import { connectDB } from "@/libs/database";
import { ITodos } from "@/types/schema";
import { WithId } from "mongodb";
import { revalidateTag } from "next/cache";

const AFTER_NINE_HOUR = 1000 * 60 * 60 * 9;

export const addTodo = async (
  userid: string | null | undefined,
  prevState: { message: string },
  formData: FormData,
) => {
  if (!userid) {
    return { message: "할 일을 추가하는 작업은 로그인이 필요합니다." };
  }

  const newTodo = formData.get("newTodo") as string;

  if (!newTodo || newTodo.length === 0)
    return { message: "할 일에 내용이 작성되어 있지 않습니다." };

  try {
    const db = (await connectDB).db("next-todo-chart-cluster");
    const todo = await db.collection("todo").insertOne({
      userid,
      textField: newTodo,
      state: "할 일",
      createdAt: new Date(Date.now() + AFTER_NINE_HOUR),
      updatedAt: new Date(Date.now() + AFTER_NINE_HOUR),
    });

    if (!todo) {
      throw new Error("Todo not found");
    }
    await db
      .collection<WithId<ITodos>>("todos")
      .findOneAndUpdate(
        { author: userid },
        { $push: { content: todo.insertedId } },
        { upsert: true },
      );
    revalidateTag("todos");
    return { message: "" };
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: `투두 추가 과정 중 에러가 발생했습니다. ${error.message}`,
      };
    }
    console.error(error);
    return { message: "" };
  }
};
