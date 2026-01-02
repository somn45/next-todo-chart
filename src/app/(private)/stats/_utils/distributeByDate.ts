import { ILineGraphData, StatStringifyId } from "@/types/schema";

export const distributeByDate = (todoSumListByState: StatStringifyId[]) => {
  let lineGraphData: ILineGraphData[] = [];
  todoSumListByState.forEach(stat => {
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

  return lineGraphData;
};
