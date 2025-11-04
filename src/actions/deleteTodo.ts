"use server";

import { connectDB } from "@/libs/database";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";

export const deleteTodo = async (
  userid: string,
  prevState: { message: string },
  formData: FormData,
) => {
  const todoid = formData.get("todoid") as string;

  const db = (await connectDB).db("next-todo-chart-cluster");
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
