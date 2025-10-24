import { getTodos } from "@/apis/getTodos";
import TodosForm from "./Form";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

interface AccessTokenPayload {
  sub: string;
}

export default async function Todos() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload = JSON.parse(
    atob(accessToken.value.split(".")[1]),
  );

  const getCachedTodos = unstable_cache(
    async () => {
      return await getTodos(userid);
    },
    [`${userid}'s todos`],
    { tags: ["todos"], revalidate: 3600 },
  );
  const todos = await getCachedTodos();

  return (
    <section>
      <h2>Todos 페이지</h2>
      <TodosForm userid={userid} />
      <ul>
        {todos.map(todo => (
          <div key={todo.content._id.toString()}>
            <span>Todos</span>
            <li key={todo.content._id.toString()}>{todo.content.textField}</li>
          </div>
        ))}
      </ul>
    </section>
  );
}
