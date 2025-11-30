import { getGroupByDateTodos } from "@/apis/getGroupByDateTodos";
import LineGraph from "./LineGraph";
import { cookies } from "next/headers";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { setTodoStats } from "@/apis/setTodoStats";
import { getTodoStats } from "@/apis/getTodoStats";

interface AccessTokenPayload {
  sub: string;
}

export default async function Stats() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  // const todos = await getGroupByDateTodos(userid);
  await setTodoStats(userid);
  const todoStats = await getTodoStats(userid);

  const stateKeys = [
    "totalCount",
    "todoStateCount",
    "doingStateCount",
    "doneStateCount",
  ];

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
