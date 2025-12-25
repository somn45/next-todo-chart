import { connectDB } from "@/libs/database";
import { Stat, TodoStats } from "@/types/schema";
import { redirect } from "next/navigation";

const ONE_DAY = 1000 * 60 * 60 * 24;

export const getTodoStats = async (userid: string | undefined | null) => {
  if (!userid) {
    return redirect("/login");
  }

  const db = (await connectDB).db("next-todo-chart-cluster");

  const weeks = Array.from({ length: 7 }, (_, i) => i - 1);

  const currentDateSharp = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );

  const todoStatsDoc = await Promise.all(
    weeks.map(async day => {
      const targetDate = new Date(
        currentDateSharp.getTime() - (weeks.length - 1 - day) * ONE_DAY,
      );

      const todoStatsDoc = (await db
        .collection<TodoStats>("stat")
        .aggregate([
          {
            $match: { date: targetDate },
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
        .next()) as Stat;

      return todoStatsDoc
        ? todoStatsDoc
        : {
            _id: targetDate,
            totalCount: 0,
            todoStateCount: 0,
            doingStateCount: 0,
            doneStateCount: 0,
          };
    }),
  );

  return todoStatsDoc;
};
