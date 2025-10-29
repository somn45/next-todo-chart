import { connectDB } from "@/libs/database";
import { ITodo } from "@/types/schema";
import { ObjectId, WithId } from "mongodb";

export const getTodo = async (userid: string, todoid: ObjectId) => {
  const db = (await connectDB).db("next-todo-chart-cluster");
  const todoDoc = await db
    .collection<WithId<ITodo>>("todo")
    .findOne({ _id: new ObjectId(todoid) });
  return todoDoc;
};
