import { connectDB } from "@/libs/database";
import { DateDomainBaseType } from "@/types/graph/schema";
import { TodoStat } from "@/types/stats/schema";
import { getDatesLastlyPeriod } from "@/utils/date/createDatesLastlyWeek";
import { redirect } from "next/navigation";

export const getTodoStats = async (
  userid: string | undefined | null,
  searchRange: DateDomainBaseType = "week",
) => {
  if (!userid) {
    return redirect("/login");
  }

  if (process.env.APP_ENV === "test") {
    const { mockPast7DaysTodoStats } = await import("@/constants/fakeData/fakeData");
    return mockPast7DaysTodoStats;
  }

  const db = (await connectDB).db();

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
