import { getGroupByDateTodos } from "@/apis/getGroupByDateTodos";
import LineGraph from "./LineGraph";
import { cookies } from "next/headers";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";

interface AccessTokenPayload {
  sub: string;
}

export default async function Stats() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const todos = await getGroupByDateTodos(userid);

  return <LineGraph />;
}
