"use server";

import { connectDB } from "@/libs/database";
import { type ITodo } from "@/types/schema";
import { ObjectId, WithId } from "mongodb";
import { revalidateTag } from "next/cache";

const AFTER_NINE_HOUR = 1000 * 60 * 60 * 9;

export const editTodo = async (
  { todoid, userid }: { todoid: string; userid: string | null | undefined },
  prevState: { message: string },
  formData: FormData,
) => {
  if (!userid) {
    return { message: "할 일을 수정하는 작업은 로그인이 필요합니다." };
  }

  const willEditTodo = formData.get("todo") as string;

  if (!willEditTodo || willEditTodo.length === 0)
    return { message: "할 일에 내용이 작성되어 있지 않습니다." };

  try {
    if (!todoid || typeof todoid !== "string" || !ObjectId.isValid(todoid)) {
      throw new Error(`Invalid ObjectId Type ${todoid}`);
    }

    const db = (await connectDB).db("next-todo-chart-cluster");
    const todoDoc = await db
      .collection<WithId<ITodo>>("todo")
      .findOne({ _id: new ObjectId(todoid) });

    if (!todoDoc) {
      throw new Error("Todo not found");
    }
    if (willEditTodo === todoDoc.textField) {
      return { message: "이전에 작성한 내용과 동일합니다." };
    }

    await db.collection("todo").updateOne(
      { _id: new ObjectId(todoid) },
      {
        $set: {
          textField: willEditTodo,
          updatedAt: new Date(Date.now()),
        },
      },
    );
    revalidateTag(`todo-${todoid}`);
    revalidateTag("todos");
    revalidateTag("dashboard");

    return { message: "" };
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: `투두 수정 과정 중 에러가 발생했습니다. ${error.message}`,
      };
    }
    console.error(error);
    return { message: "" };
  }
};
