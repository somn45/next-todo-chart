import { connectDB } from "@/libs/database";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { redirect } from "next/navigation";

export const getTodos = async (userid: string | undefined | null) => {
  "use cache";
  cacheTag("todos");

  if (!userid) {
    redirect("/login");
  }

  const db = (await connectDB).db("next-todo-chart-cluster");
  const todosDoc = await db
    .collection("todos")
    .aggregate([
      {
        $match: {
          author: userid,
        },
      },
      {
        $lookup: {
          from: "todo",
          localField: "content",
          foreignField: "_id",
          as: "content",
        },
      },
      {
        $unwind: {
          path: "$content",
        },
      },
      {
        $set: {
          _id: { $toString: "$_id" },
        },
      },
    ])
    .toArray();

  return JSON.parse(JSON.stringify(todosDoc)) as (LookupedTodo &
    WithStringifyId)[];
};
