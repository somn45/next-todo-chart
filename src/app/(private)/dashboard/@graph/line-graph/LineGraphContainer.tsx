import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import LineGraphSparkline from "./Sparkline";
import { distributeByDate } from "@/app/(private)/stats/_utils/distributeByDate";

export default async function LineGraphContainer({
  userid,
  searchRange = "week",
}: {
  userid: string;
  searchRange?: "week" | "month" | "year";
}) {
  const { todoStats } = await getIntegratedTodos(userid, searchRange);

  // [date, state, count]
  const lineGraphData = distributeByDate(todoStats);

  return (
    <LineGraphSparkline stats={lineGraphData} dateDomainBase={searchRange} />
  );
}
