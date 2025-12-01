import LineGraph from "./LineGraph";
import { setTodoStats } from "@/apis/setTodoStats";
import { getTodoStats } from "@/apis/getTodoStats";

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default async function LineGraphWrapper({ userid }: { userid: string }) {
  await delay(10000);

  await setTodoStats(userid);
  const todoStats = await getTodoStats(userid);

  // [date, state, count]
  let lineGraphData: { date: Date; state: string; count: number }[] = [];
  todoStats.forEach(stat => {
    const totalStat = {
      date: stat._id,
      state: "총합",
      count: stat.totalCount,
    };
    const todoStateStat = {
      date: stat._id,
      state: "할 일",
      count: stat.todoStateCount,
    };
    const doingStateStat = {
      date: stat._id,
      state: "진행 중",
      count: stat.doingStateCount,
    };
    const doneStateStat = {
      date: stat._id,
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
