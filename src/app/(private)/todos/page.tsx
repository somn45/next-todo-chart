import { getTodos } from "@/apis/getTodos";
import TodosForm from "./Form";

export default async function Todos() {
  const todos = await getTodos();
  return (
    <section>
      <h2>Todos 페이지</h2>
      <TodosForm />
      <ul>
        {todos.map(todo => (
          <li key={todo.content._id.toString()}>{todo.content.textField}</li>
        ))}
      </ul>
    </section>
  );
}
