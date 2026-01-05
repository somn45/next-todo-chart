import { getAllTodos } from "@/apis/getAllTodos";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import TimeLineSparkline from "./Sparkline";
import { setTodoStats } from "@/apis/setTodoStats";

interface AccessTokenPayload {
  sub: string;
}

export default async function DashboardTimeline() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  await setTodoStats(userid);
  const todos = await getAllTodos(userid);

  return <TimeLineSparkline todos={todos} dateDomainBase="week" />;
}
