import { getAllTodos } from "@/apis/getAllTodos";
import { createDatesOfCurrentYear } from "@/utils/date/createDatesOfCurrentWeek";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import TimeLine from "../../../TimeLine";

interface AccessTokenPayload {
  sub: string;
}

export default async function TimelineWeekly() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const todos = await getAllTodos(userid, "week");
  return <TimeLine todos={todos} dateDomainBase="week" />;
}
