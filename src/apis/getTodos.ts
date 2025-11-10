import { connectDB } from "@/libs/database";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import { unstable_cacheTag as cacheTag } from "next/cache";

export const getTodos = async (userid: string) => {
  "use cache";
  cacheTag("todos");
  const db = (await connectDB).db("next-todo-chart-cluster");
  const todosDoc = (await db
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
    .toArray()) as (LookupedTodo & WithStringifyId)[];

  return todosDoc;
};
