import { connectDB } from "@/libs/database";
import { LookupedTodo } from "@/types/schema";
import { ObjectId, WithId } from "mongodb";
import { cookies } from "next/headers";

interface AccessTokenPayload {
  sub: string;
}

export const getTodos = async (userid: string) => {
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
    ])
    .toArray()) as WithId<LookupedTodo>[];

  return todosDoc;
};
