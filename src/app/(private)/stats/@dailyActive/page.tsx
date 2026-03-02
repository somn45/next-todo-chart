import { getTodoStats } from "@/apis/getTodoStats";
import DailyActiveTodoLineGraph from "@/components/domain/Stat/DailyActiveTodoLineGraph";
import { DataDomainBaseType } from "@/types/graph/schema";
import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";

export default async function DailyActive({
  searchParams,
}: {
  searchParams: Promise<{
    tl: DataDomainBaseType;
    da: DataDomainBaseType;
  }>;
}) {
  const userid = await getUserIdByHeaders();

  const { da } = await searchParams;

  const todoStats = await getTodoStats(userid, da || "week");

  // [date, state, count]
  return <DailyActiveTodoLineGraph stats={todoStats} dateDomainBase={da} />;
}
