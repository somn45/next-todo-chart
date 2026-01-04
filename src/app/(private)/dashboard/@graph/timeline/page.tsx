import { getAllTodos } from "@/apis/getAllTodos";
import TimeLine from "@/app/(private)/stats/TimeLine";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";

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

  const todos = await getAllTodos(userid);

  return <TimeLine todos={todos} />;
}
