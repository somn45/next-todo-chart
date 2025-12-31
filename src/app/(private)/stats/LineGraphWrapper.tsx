import LineGraph from "./LineGraph";
import { setTodoStats } from "@/apis/setTodoStats";
import { getTodoStats } from "@/apis/getTodoStats";
import { ILineGraphData } from "@/types/schema";

export default async function LineGraphWrapper({ userid }: { userid: string }) {
  await setTodoStats(userid);
  const todoStats = await getTodoStats(userid);

  // [date, state, count]
  let lineGraphData: ILineGraphData[] = [];
  todoStats.forEach(stat => {
    const totalStat = {
      date: new Date(stat._id),
      state: "총합",
      count: stat.totalCount,
    };
    const todoStateStat = {
      date: new Date(stat._id),
      state: "할 일",
      count: stat.todoStateCount,
    };
    const doingStateStat = {
      date: new Date(stat._id),
      state: "진행 중",
      count: stat.doingStateCount,
    };
    const doneStateStat = {
      date: new Date(stat._id),
      state: "완료",
      count: stat.doneStateCount,
    };
    lineGraphData = [
      ...lineGraphData,
      totalStat,
      todoStateStat,
      doingStateStat,
      doneStateStat,
    ];
  });

  return <LineGraph stats={lineGraphData} />;
}
