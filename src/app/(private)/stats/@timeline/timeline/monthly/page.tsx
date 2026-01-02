import { getAllTodos } from "@/apis/getAllTodos";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";

interface AccessTokenPayload {
  sub: string;
}

export default async function TimelineMonthly() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const todos = await getAllTodos(userid, "month");
  console.log(todos);
  return <div>1 주 간의 타임라인</div>;
}
