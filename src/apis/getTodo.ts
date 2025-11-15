import { connectDB } from "@/libs/database";
import { ITodo, WithStringifyId } from "@/types/schema";
import { ObjectId } from "mongodb";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { redirect } from "next/navigation";

export const getTodo = async (
  userid: string | null | undefined,
  todoid: string,
) => {
  "use cache";
  cacheTag(`todo-${todoid}`);

  if (!userid) {
    return redirect("/login");
  }
  if (!todoid || typeof todoid !== "string" || !ObjectId.isValid(todoid)) {
    throw new Error(`Invalid ObjectId Type ${todoid}`);
  }

  const db = (await connectDB).db("next-todo-chart-cluster");
  const todoDoc = await db
    .collection("todo")
    .aggregate([
      {
        $match: {
          userid,
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
