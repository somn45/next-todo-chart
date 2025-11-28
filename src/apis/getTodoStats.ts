import { connectDB } from "@/libs/database";
import { TodoStats } from "@/types/schema";
import { redirect } from "next/navigation";

export const getTodoStats = async (userid: string | undefined | null) => {
  if (!userid) {
    redirect("/login");
  }

  const db = (await connectDB).db("next-todo-chart-cluster");

  const prevDateeSharp = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 1,
  );

  const todoStatsDoc = await db
    .collection<TodoStats>("stat")
    .aggregate([
      {
        $match: { date: prevDateeSharp },
      },
      {
        $group: {
          _id: "$date",
          totalCount: {
            $sum: 1,
          },
          todoStateCount: {
            $sum: {
              $cond: [{ $eq: ["$todo.state", "할 일"] }, 1, 0],
            },
          },
          doingStateCount: {
            $sum: {
              $cond: [{ $eq: ["$todo.state", "진행 중"] }, 1, 0],
            },
          },
          doneStateCount: {
            $sum: {
              $cond: [{ $eq: ["$todo.state", "완료"] }, 1, 0],
            },
          },
        },
      },
    ])
    .toArray();

  return todoStatsDoc;
};
