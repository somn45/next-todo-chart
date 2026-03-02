import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import LineGraphSparkline from "./Sparkline";
import { DataDomainBaseType } from "@/types/graph/schema";

export default async function LineGraphContainer({
  userid,
  searchRange = "week",
}: {
  userid: string;
  searchRange?: DataDomainBaseType;
}) {
  const { todoStats } = await getIntegratedTodos(userid, searchRange);

  return <LineGraphSparkline stats={todoStats} dateDomainBase={searchRange} />;
}
