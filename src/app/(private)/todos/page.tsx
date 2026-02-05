import { getTodos } from "@/apis/getTodos";
import TodoWrapper from "@/components/domain/Todo/TodoWrapper";
import AddTodoForm from "@/components/ui/organisms/AddTodoForm";
import { ClientTodo } from "@/types/schema";
import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";

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
  return (
    <section>
      <h2>Todos 페이지</h2>
      <AddTodoForm userId={userId} />
      <ul>
        {todos.map(todo => (
          <TodoWrapper key={todo.content._id} todo={todo.content} />
        ))}
      </ul>
    </section>
  );
}
