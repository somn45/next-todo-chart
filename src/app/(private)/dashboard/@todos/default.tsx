import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import TodosForm from "../../todos/Form";
import TodoWrapper from "@/components/domain/Todo/TodoWrapper";

interface AccessTokenPayload {
  sub: string;
}

export default async function DashBoardTodos() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const { activeTodos } = await getIntegratedTodos(userid);

  return (
    <div>
      <TodosForm userid={userid} />
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
