import { connectDB } from "@/libs/database";
import { ITodo, WithStringifyId } from "@/types/schema";
import { ObjectId } from "mongodb";
import { unstable_cacheTag as cacheTag } from "next/cache";

export const getTodo = async (userid: string, todoid: string) => {
  "use cache";
  cacheTag(`todo-${todoid}`);

  const db = (await connectDB).db("next-todo-chart-cluster");
  const todoDoc = await db
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
    .next();

  return JSON.parse(JSON.stringify(todoDoc)) as ITodo & WithStringifyId;
};
