import EditForm from "./EditForm";
import { getTodo } from "@/apis/getTodo";
import Deleteform from "./DeleteForm";
import { LookupedTodo } from "@/types/schema";

export default async function TodoPage({
  _id,
  userid,
  state,
}: LookupedTodo["content"]) {
  const todo = await getTodo(userid, _id);

  if (!todo) return <li>등록된 투두리스트가 없습니다.</li>;
  return (
    <li>
      <span data-testid="todo-textField">{todo.textField}</span>
      <span>현재 상태 {state}</span>
      <ul>
        <li>
          <button>할 일</button>
        </li>
        <li>
          <button>진행 중</button>
        </li>
        <li>
          <button>완료</button>
        </li>
      </ul>
      <EditForm todoid={todo._id} userid={todo.userid} />
      <Deleteform todoid={todo._id} userid={todo.userid} />
    </li>
  );
}
