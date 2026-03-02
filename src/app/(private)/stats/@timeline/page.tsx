import { getAllTodos } from "@/apis/getAllTodos";
import TodoTimeline from "@/components/domain/Stat/TodoTimeline";
import { DataDomainBaseType } from "@/types/graph/schema";
import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";

export default async function Timeline({
  searchParams,
}: {
  searchParams: Promise<{
    tl: DataDomainBaseType;
    da: DataDomainBaseType;
  }>;
}) {
  const userid = await getUserIdByHeaders();

  const { tl } = await searchParams;

  const todos = await getAllTodos(userid, tl || "week");

  return <TodoTimeline todos={todos} dateDomainBase={tl} />;
}
