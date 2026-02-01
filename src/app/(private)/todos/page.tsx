import { getTodos } from "@/apis/getTodos";
import TodoWrapper from "@/components/domain/Todo/TodoWrapper";
import getUserIdWithAccessToken from "@/utils/auth/getUserIdWithAccessToken";
import AddTodoForm from "@/components/ui/organisms/AddTodoForm";

export default async function Todos() {
  const userid = await getUserIdWithAccessToken();
  const todos = await getTodos(userid);

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
      <AddTodoForm userid={userid} />
      <ul>
        {todos.map(todo => (
          <TodoWrapper key={todo.content._id} todo={todo.content} />
        ))}
      </ul>
    </section>
  );
}
