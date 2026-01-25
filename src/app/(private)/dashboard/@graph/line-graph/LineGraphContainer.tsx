import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import LineGraphSparkline from "./Sparkline";

export default async function LineGraphContainer({
  userid,
  searchRange = "week",
}: {
  userid: string;
  searchRange?: "week" | "month" | "year";
}) {
  const { todoStats } = await getIntegratedTodos(userid, searchRange);

  return <LineGraphSparkline stats={todoStats} dateDomainBase={searchRange} />;
}
