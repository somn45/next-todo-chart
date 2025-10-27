import { connectDB } from "@/libs/database";
import { ObjectId } from "mongodb";

interface TodoDoc {
  _id: ObjectId;
  userid: string;
  textField: string;
}

export const getTodo = async (userid: string, todoid: ObjectId) => {
  const db = (await connectDB).db("next-todo-chart-cluster");
  const todoDoc = await db
    .collection<TodoDoc>("todo")
    .findOne({ _id: new ObjectId(todoid) });
  return todoDoc;
};
