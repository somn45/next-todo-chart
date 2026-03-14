import { connectDB } from "@/libs/database";
import { DataDomainBaseType } from "@/types/graph/schema";
import { TodoStat } from "@/types/stats/schema";
import { getDatesLastlyPeriod } from "@/utils/date/createDatesLastlyWeek";
import { redirect } from "next/navigation";

export const getTodoStats = async (
  userid: string | undefined | null,
  searchRange: DataDomainBaseType = "week",
) => {
  if (!userid) {
    return redirect("/login");
  }

  const db = (await connectDB).db("next-todo-chart-cluster");

  const dateListLastlyPeriod = getDatesLastlyPeriod(searchRange);

  const stats = (await db
    .collection("stats")
    .aggregate([
      {
        $match: { date: { $in: dateListLastlyPeriod } },
      },
      { $project: { _id: 0 } },
    ])
    .toArray()) as TodoStat[];

  return stats as TodoStat[];
};
