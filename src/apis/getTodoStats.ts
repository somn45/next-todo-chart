import { connectDB } from "@/libs/database";
import { TodoStats } from "@/types/schema";
import { redirect } from "next/navigation";

const ONE_DAY = 1000 * 60 * 60 * 24;

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

  const nowDay = new Date().getDay();
  const weeks = Array.from({ length: 7 }, (_, i) => i);
  const dayOfWeeks = [];
  for (const day of weeks) {
    if (day <= nowDay) {
      const subDay = nowDay - day;

      const currentDateSharp = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      );

      dayOfWeeks.push(new Date(currentDateSharp.getTime() - ONE_DAY * subDay));
    }
  }

  const todoStatsDoc = await db
    .collection<TodoStats>("stat")
    .aggregate([
      {
        $match: { date: { $in: dayOfWeeks } },
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

  console.log(todoStatsDoc);

  return todoStatsDoc;
};
