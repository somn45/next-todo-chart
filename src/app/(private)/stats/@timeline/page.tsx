import { getAllTodos } from "@/apis/getAllTodos";
import TodoTimeline from "@/components/domain/Stat/TodoTimeline";
import { DateDomainBaseType } from "@/types/graph/schema";
import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";

export default async function Timeline({
  searchParams,
}: {
  searchParams: Promise<{
    tl: DateDomainBaseType;
    da: DateDomainBaseType;
  }>;
}) {
  const userid = await getUserIdByHeaders();

  const { tl } = await searchParams;

  const todos = await getAllTodos(userid, tl || "week");

  return <TodoTimeline todos={todos} dateDomainBase={tl} />;
}
