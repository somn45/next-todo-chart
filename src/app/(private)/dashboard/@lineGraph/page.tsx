import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import { ILineGraphData } from "@/types/schema";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import LineGraph from "../../stats/LineGraph";

interface AccessTokenPayload {
  sub: string;
}

export default async function DashBoardLineGraph() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const { todoStats } = await getIntegratedTodos(userid);

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
