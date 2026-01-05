import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import TimeLineSparkline from "./Sparkline";

export default async function TimelineContainer({
  userid,
  searchRange = "week",
}: {
  userid: string;
  searchRange?: "week" | "month" | "year";
}) {
  const { activeTodos } = await getIntegratedTodos(userid, searchRange);
  return <TimeLineSparkline todos={activeTodos} dateDomainBase={searchRange} />;
}
