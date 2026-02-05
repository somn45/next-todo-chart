import { getAllTodos } from "@/apis/getAllTodos";
import TodoTimeline from "@/components/domain/Stat/TodoTimeline";
import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";

export default async function Timeline({
  searchParams,
}: {
  searchParams: Promise<{
    tl: "week" | "month" | "year";
    da: "week" | "month" | "year";
  }>;
}) {
  const userid = await getUserIdByHeaders();

  const { tl } = await searchParams;

  const todos = await getAllTodos(userid, tl || "week");

  return <TodoTimeline todos={todos} dateDomainBase={tl} />;
}
