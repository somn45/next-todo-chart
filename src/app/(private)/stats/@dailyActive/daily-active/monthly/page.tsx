import { cookies } from "next/headers";
import LineGraph from "../../../LineGraph";
import { distributeByDate } from "../../../_utils/distributeByDate";
import { getTodoStats } from "@/apis/getTodoStats";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";

interface AccessTokenPayload {
  sub: string;
}

export default async function DailyActiveMonthly() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const todoStats = await getTodoStats(userid, "month");

  const lineGraphData = distributeByDate(todoStats);
  return <LineGraph stats={lineGraphData} />;
}
