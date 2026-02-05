import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import TodoWrapper from "@/components/domain/Todo/TodoWrapper";
import AddTodoForm from "@/components/ui/organisms/AddTodoForm";
import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";

export default async function DashBoardTodos() {
  const userId = await getUserIdByHeaders();
  const { activeTodos } = await getIntegratedTodos(userId);

  return (
    <div>
      <AddTodoForm userId={userId} />
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
