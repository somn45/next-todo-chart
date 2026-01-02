import { getAllTodos } from "@/apis/getAllTodos";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";

interface AccessTokenPayload {
  sub: string;
}

export default async function TimelineYearly() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const todos = await getAllTodos(userid, "year");
  console.log(todos);
  return <div>1 년 간의 타임라인</div>;
}
