import { getTodos } from "@/apis/getTodos";

import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";
import TodosPage from "./TodosPage";

export default async function Todos() {
  const userId = await getUserIdByHeaders();
  const todos = await getTodos(userId);

  if (!todos)
    return (
      <section>
        <span data-testid="todos-alternative-ui">
          오늘 할 일이 아직 정해지지 않았어요. 어서 할 일을 생성해 봐요!
        </span>
      </section>
    );
  return <TodosPage userId={userId} todos={todos} />;
}
