import { getTodoStats } from "@/apis/getTodoStats";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import { distributeByDate } from "../_utils/distributeByDate";
import DailyActiveTodoLineGraph from "@/components/domain/Stat/DailyActiveTodoLineGraph";

interface AccessTokenPayload {
  sub: string;
}

export default async function DailyActive({
  searchParams,
}: {
  searchParams: Promise<{
    tl: "week" | "month" | "year";
    da: "week" | "month" | "year";
  }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const { da } = await searchParams;

  const todoStats = await getTodoStats(userid, da || "week");

  // [date, state, count]
  const lineGraphData = distributeByDate(todoStats);
  return <DailyActiveTodoLineGraph stats={lineGraphData} dateDomainBase={da} />;
}
