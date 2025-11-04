import { connectDB } from "@/libs/database";
import { ITodo, WithStringifyId } from "@/types/schema";
import { ObjectId } from "mongodb";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const getTodo = async (userid: string, todoid: string) => {
  "use cache";
  cacheTag(`todo-${todoid}`);

  const db = (await connectDB).db("next-todo-chart-cluster");
  const todoDoc = (await db
    .collection("todo")
    .aggregate([
      {
        $match: {
          _id: new ObjectId(todoid),
        },
      },
      {
        $set: {
          _id: { $toString: "$_id" },
        },
      },
    ])
    .next()) as ITodo & WithStringifyId;
  return todoDoc;
};
