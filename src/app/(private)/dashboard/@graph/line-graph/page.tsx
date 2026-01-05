import { getTodoStats } from "@/apis/getTodoStats";
import { distributeByDate } from "@/app/(private)/stats/_utils/distributeByDate";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import LineGraphSparkline from "./Sparkline";
import { getIntegratedTodos } from "@/apis/getIntegratedTodos";

interface AccessTokenPayload {
  sub: string;
}

export default async function DashboardDailyActive() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const { todoStats } = await getIntegratedTodos(userid);

  // [date, state, count]
  const lineGraphData = distributeByDate(todoStats);
  return (
    <section>
      <LineGraphSparkline stats={lineGraphData} />
      <LineGraphSparkline stats={lineGraphData} dateDomainBase="month" />
      <LineGraphSparkline stats={lineGraphData} dateDomainBase="year" />
    </section>
  );
}
