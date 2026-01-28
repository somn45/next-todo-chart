import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import TodosForm from "../../todos/Form";
import TodoWrapper from "@/components/domain/Todo/TodoWrapper";
import getUserIdWithAccessToken from "@/utils/auth/getUserIdWithAccessToken";

export default async function DashBoardTodos() {
  const userid = await getUserIdWithAccessToken();

  const { activeTodos } = await getIntegratedTodos(userid);

  return (
    <div>
      <TodosForm userid={userid} />
      {activeTodos.map(todo => (
        <TodoWrapper
          key={todo.content._id}
          todo={todo.content}
          showDeleteSection={false}
        />
      ))}
    </div>
  );
}
