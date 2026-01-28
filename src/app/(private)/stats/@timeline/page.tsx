import { getAllTodos } from "@/apis/getAllTodos";
import TodoTimeline from "@/components/domain/Stat/TodoTimeline";
import getUserIdWithAccessToken from "@/utils/auth/getUserIdWithAccessToken";

export default async function Timeline({
  searchParams,
}: {
  searchParams: Promise<{
    tl: "week" | "month" | "year";
    da: "week" | "month" | "year";
  }>;
}) {
  const userid = await getUserIdWithAccessToken();

  const { tl } = await searchParams;

  const todos = await getAllTodos(userid, tl || "week");

  return <TodoTimeline todos={todos} dateDomainBase={tl} />;
}
