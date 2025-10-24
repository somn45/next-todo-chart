import { connectDB } from "@/libs/database";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

interface AccessTokenPayload {
  sub: string;
}

interface TodoDoc {
  _id: ObjectId;
  userid: string;
  textField: string;
}

interface TodosDoc {
  _id: ObjectId;
  author: string;
  content: TodoDoc;
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
    .toArray()) as TodosDoc[];

  return todosDoc;
};
