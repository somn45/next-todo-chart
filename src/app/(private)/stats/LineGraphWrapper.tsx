import LineGraph from "./LineGraph";
import { setTodoStats } from "@/apis/setTodoStats";
import { getTodoStats } from "@/apis/getTodoStats";
import { distributeByDate } from "./_utils/distributeByDate";

export default async function LineGraphWrapper({ userid }: { userid: string }) {
  await setTodoStats(userid);
  const todoStats = await getTodoStats(userid);

  // [date, state, count]
  const lineGraphData = distributeByDate(todoStats);
  return <LineGraph stats={lineGraphData} />;
}
