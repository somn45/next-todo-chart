import { getTodos } from "@/apis/getTodos";
import TodosForm from "./Form";
import { cookies } from "next/headers";
import TodoPage from "../../../components/domain/Todo/Todo";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";

interface AccessTokenPayload {
  sub: string;
}

export default async function Todos() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const todos = await getTodos(userid);

  if (!todos)
    return (
      <section>
        <span>
          오늘 할 일이 아직 정해지지 않았어요. 어서 할 일을 생성해 봐요!
        </span>
      </section>
    );
  return (
    <section>
      <h2>Todos 페이지</h2>
      <TodosForm userid={userid} />
      <ul>
        {todos.map(todo => (
          <TodoPage key={todo.content._id} {...todo.content} />
        ))}
      </ul>
    </section>
  );
}
