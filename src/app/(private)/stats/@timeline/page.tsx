import { getAllTodos } from "@/apis/getAllTodos";
import TodoTimeline from "@/components/domain/Stat/TodoTimeline";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";

interface AccessTokenPayload {
  sub: string;
}

export default async function Timeline({
  searchParams,
}: {
  searchParams: Promise<{
    tl: "week" | "month" | "year";
    da: "week" | "month" | "year";
  }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const { tl } = await searchParams;

  const todos = await getAllTodos(userid, tl || "week");

  return <TodoTimeline todos={todos} dateDomainBase={tl} />;
}
