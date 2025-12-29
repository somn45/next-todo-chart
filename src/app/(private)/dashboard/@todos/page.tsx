import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";

interface AccessTokenPayload {
  sub: string;
}

export default async function DashBoardTodos() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const { activeTodos } = await getIntegratedTodos(userid);

  return <div>투두 리스트</div>;
}
