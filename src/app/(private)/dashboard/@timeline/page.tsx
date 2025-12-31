import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import TimeLine from "../../stats/TimeLine";

interface AccessTokenPayload {
  sub: string;
}

export default async function DashBoardTimeline() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const { todosIncludeThisWeek } = await getIntegratedTodos(userid);

  return (
    <div>
      <TimeLine todos={todosIncludeThisWeek} />
    </div>
  );
}
