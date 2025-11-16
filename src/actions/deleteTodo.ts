"use server";

import { connectDB } from "@/libs/database";
import { ITodo } from "@/types/schema";
import { ObjectId, WithId } from "mongodb";
import { revalidateTag } from "next/cache";

export const deleteTodo = async (
  userid: string | null | undefined,
  prevState: { message: string },
  formData: FormData,
) => {
  if (!userid) {
    return { message: "할 일을 삭제하는 작업은 로그인이 필요합니다." };
  }

  const todoid = formData.get("todoid") as string;

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
    if (todoDoc.userid !== userid) {
      return { message: "투두를 작성한 사용자만 투두를 삭제할 수 있습니다." };
    }

    await db.collection("todo").deleteOne({ _id: new ObjectId(todoid) });
    await db.collection<ITodo>("todos").updateOne(
      {
        author: userid,
      },
      {
        $pull: { content: new ObjectId(todoid) },
      },
    );

    revalidateTag(`todo-${todoid}`);
    revalidateTag("todos");

    return { message: "" };
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: `투두 삭제 과정 중 에러가 발생했습니다. ${error.message}`,
      };
    }
    console.error(error);
    return { message: "" };
  }
};
