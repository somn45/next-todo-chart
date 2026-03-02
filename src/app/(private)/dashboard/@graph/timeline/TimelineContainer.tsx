import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import TimeLineSparkline from "./Sparkline";
import { DataDomainBaseType } from "@/types/graph/schema";

export default async function TimelineContainer({
  userid,
  searchRange = "week",
}: {
  userid: string;
  searchRange?: DataDomainBaseType;
}) {
  const { activeTodos } = await getIntegratedTodos(userid, searchRange);
  return <TimeLineSparkline todos={activeTodos} dateDomainBase={searchRange} />;
}
