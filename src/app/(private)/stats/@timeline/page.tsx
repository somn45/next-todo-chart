import { getAllTodos } from "@/apis/getAllTodos";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import TimeLine from "../TimeLine";

interface AccessTokenPayload {
  sub: string;
}

export default async function TimelineWrapper() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const todos = await getAllTodos(userid);

  return <TimeLine todos={todos} />;
}
