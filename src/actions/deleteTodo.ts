"use server";

import { connectDB } from "@/libs/database";
import { ITodo } from "@/types/schema";
import { ObjectId, WithId } from "mongodb";
import { revalidateTag } from "next/cache";

export const deleteTodo = async (
  userid: string,
  prevState: { message: string },
  formData: FormData,
) => {
  const todoid = formData.get("todoid") as string;

  const db = (await connectDB).db("next-todo-chart-cluster");
  const todoDoc = await db
    .collection<WithId<ITodo>>("todo")
    .findOne({ _id: new ObjectId(todoid) });

  if (!todoDoc) {
    return { message: "조회 결과 해당 투두가 없습니다." };
  }
  if (todoDoc.userid !== userid) {
    return { message: "투두를 작성한 사용자만 투두를 삭제할 수 있습니다." };
  }

  await db.collection("todo").deleteOne({ _id: new ObjectId(todoid) });
  await db.collection("todos").updateOne(
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
};
