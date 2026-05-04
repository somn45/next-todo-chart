import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import LineGraphSparkline from "./Sparkline";
import { DateDomainBaseType } from "@/types/graph/schema";

export default async function LineGraphContainer({
  userid,
  searchRange = "week",
}: {
  userid: string;
  searchRange?: DateDomainBaseType;
}) {
  const { todoStats } = await getIntegratedTodos(userid, searchRange);

  return <LineGraphSparkline stats={todoStats} dateDomainBase={searchRange} />;
}
