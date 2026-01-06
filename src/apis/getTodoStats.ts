import { connectDB } from "@/libs/database";
import { Stat, StatStringifyId } from "@/types/schema";
import { getDatesLastlyPeriod } from "@/utils/date/createDatesLastlyWeek";
import { redirect } from "next/navigation";

export const getTodoStats = async (
  userid: string | undefined | null,
  searchRange: "week" | "month" | "year" = "week",
) => {
  if (!userid) {
    return redirect("/login");
  }

  const db = (await connectDB).db("next-todo-chart-cluster");

  const dateListLastlyPeriod = getDatesLastlyPeriod(searchRange);

  const statsDoc = (await db
    .collection("stat")
    .aggregate([
      {
        $match: { date: { $in: dateListLastlyPeriod } },
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
      { $sort: { _id: 1 } },
    ])
    .toArray()) as Stat[];
  return JSON.parse(JSON.stringify(statsDoc)) as StatStringifyId[];
};
