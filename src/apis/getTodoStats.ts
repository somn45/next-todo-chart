import { connectDB } from "@/libs/database";
import { Stat, StatStringifyId, TodoStats } from "@/types/schema";
import {
  createDatesLastlyWeek,
  getDatesLastlyPeriod,
} from "@/utils/date/createDatesLastlyWeek";
import { redirect } from "next/navigation";

export const getTodoStats = async (
  userid: string | undefined | null,
  searchRange: "week" | "month" | "year" = "week",
) => {
  if (!userid) {
    return redirect("/login");
  }

  const db = (await connectDB).db("next-todo-chart-cluster");

  const dateListLastlyWeek = createDatesLastlyWeek();

  const datesLastlyPeriod = getDatesLastlyPeriod(searchRange);

  // 현재 날짜의 00:00시 가져오기
  const todoStatsDoc = await Promise.all(
    datesLastlyPeriod.map(async dateInLastPeriod => {
      const todoStatsDoc = (await db
        .collection<TodoStats>("stat")
        .aggregate([
          {
            $match: { date: dateInLastPeriod },
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
            _id: dateInLastPeriod,
            totalCount: 0,
            todoStateCount: 0,
            doingStateCount: 0,
            doneStateCount: 0,
          };
    }),
  );

  return JSON.parse(JSON.stringify(todoStatsDoc)) as StatStringifyId[];
};
