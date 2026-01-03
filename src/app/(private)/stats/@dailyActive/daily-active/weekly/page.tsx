import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import LineGraph from "../../../LineGraph";
import { distributeByDate } from "../../../_utils/distributeByDate";
import { getTodoStats } from "@/apis/getTodoStats";
import { setTodoStats } from "@/apis/setTodoStats";

interface AccessTokenPayload {
  sub: string;
}

export default async function DailyActiveWeekly() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  // 사용자가 페이지를 접속하지 않으면 투두의 합이 0개로 저장되는 문제 발생
  await setTodoStats(userid);
  const todoStats = await getTodoStats(userid);

  // [date, state, count]
  const lineGraphData = distributeByDate(todoStats);
  return <LineGraph stats={lineGraphData} />;
}
