import { getTodoStats } from "@/apis/getTodoStats";
import DailyActiveTodoLineGraph from "@/components/domain/Stat/DailyActiveTodoLineGraph";
import getUserIdWithAccessToken from "@/utils/auth/getUserIdWithAccessToken";

export default async function DailyActive({
  searchParams,
}: {
  searchParams: Promise<{
    tl: "week" | "month" | "year";
    da: "week" | "month" | "year";
  }>;
}) {
  const userid = await getUserIdWithAccessToken();

  const { da } = await searchParams;

  const todoStats = await getTodoStats(userid, da || "week");

  // [date, state, count]
  return <DailyActiveTodoLineGraph stats={todoStats} dateDomainBase={da} />;
}
