import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import TodoWrapper from "@/components/domain/Todo/TodoWrapper";
import AddTodoForm from "@/components/ui/organisms/AddTodoForm";
import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";

export default async function DashBoardTodos() {
  const userid = await getUserIdByHeaders();

  const { activeTodos } = await getIntegratedTodos(userid);

  return (
    <div>
      <AddTodoForm userId={userid} />
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
