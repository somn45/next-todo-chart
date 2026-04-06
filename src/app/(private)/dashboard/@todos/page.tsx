import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";
import DashboardTodosPage from "./DashboardTodosPage";

export default async function DashBoardTodos() {
  const userid = await getUserIdByHeaders();

  const { activeTodos } = await getIntegratedTodos(userid);

  return <DashboardTodosPage userId={userid} todos={activeTodos} />;
}
