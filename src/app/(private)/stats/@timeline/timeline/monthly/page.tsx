import { getAllTodos } from "@/apis/getAllTodos";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import TimeLine from "../../../TimeLine";

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

  return <TimeLine todos={todos} dateDomainBase="month" />;
}
