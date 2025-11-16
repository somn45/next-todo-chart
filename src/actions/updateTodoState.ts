"use server";

import { connectDB } from "@/libs/database";
import { ITodo } from "@/types/schema";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";

const AFTER_NINE_HOUR = 1000 * 60 * 60 * 9;

export const updateTodoState = async (
  todoid: string,
  prevState: { message: string },
  formData: FormData,
) => {
  const state = formData.get("state");

  try {
    if (!todoid || typeof todoid !== "string" || !ObjectId.isValid(todoid)) {
      throw new Error(`Invalid ObjectId Type ${todoid}`);
    }

    const db = (await connectDB).db("next-todo-chart-cluster");
    const todoDoc = await db
      .collection<ITodo>("todo")
      .findOne({ _id: new ObjectId(todoid) });

    if (!todoDoc) {
      throw new Error("Todo not found");
    }
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
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: `투두 상태 수정 과정 중 에러가 발생했습니다. ${error.message}`,
      };
    }
    console.error(error);
    return { message: "" };
  }
};
