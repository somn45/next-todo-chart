import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import TodoWrapper from "@/components/domain/Todo/TodoWrapper";
import AddTodoForm from "@/components/ui/organisms/AddTodoForm";
import getUserIdWithAccessToken from "@/utils/auth/getUserIdWithAccessToken";

export default async function DashBoardTodos() {
  const userid = await getUserIdWithAccessToken();
  const { activeTodos } = await getIntegratedTodos(userid);

  return (
    <div>
      <AddTodoForm userid={userid} />
      {activeTodos.slice(0, 3).map(todo => (
        <TodoWrapper
          key={todo.content._id}
          todo={todo.content}
          showDeleteSection={false}
        />
      ))}
    </div>
  );
}
