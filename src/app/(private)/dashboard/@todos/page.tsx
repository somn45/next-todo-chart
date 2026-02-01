import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import TodoWrapper from "@/components/domain/Todo/TodoWrapper";
import getUserIdWithAccessToken from "@/utils/auth/getUserIdWithAccessToken";
import AddTodoForm from "@/components/ui/organisms/AddTodoForm";

export default async function DashBoardTodos() {
  const userid = await getUserIdWithAccessToken();

  const { activeTodos } = await getIntegratedTodos(userid);

  return (
    <div>
      <AddTodoForm userid={userid} />
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
