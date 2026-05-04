import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import TimeLineSparkline from "./Sparkline";
import { DateDomainBaseType } from "@/types/graph/schema";

export default async function TimelineContainer({
  userid,
  searchRange = "week",
}: {
  userid: string;
  searchRange?: DateDomainBaseType;
}) {
  const { activeTodos } = await getIntegratedTodos(userid, searchRange);
  return <TimeLineSparkline todos={activeTodos} dateDomainBase={searchRange} />;
}
