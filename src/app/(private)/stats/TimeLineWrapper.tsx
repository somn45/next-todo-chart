import { getAllTodos } from "@/apis/getAllTodos";
import TimeLine from "./TimeLine";

export default async function TimeLineWrapper({ userid }: { userid: string }) {
  const todos = await getAllTodos(userid);
  return <TimeLine todos={todos} />;
}
