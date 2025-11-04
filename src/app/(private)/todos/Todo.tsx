import EditForm from "./EditForm";
import { getTodo } from "@/apis/getTodo";
import Deleteform from "./DeleteForm";
import { LookupedTodo } from "@/types/schema";

export default async function TodoPage({
  _id,
  userid,
}: LookupedTodo["content"]) {
  const todo = await getTodo(userid, _id);
  console.log(typeof todo._id);

  if (!todo) return <li>등록된 투두리스트가 없습니다.</li>;
  return (
    <li>
      <span>{todo.userid}</span>
      <span>{todo.textField}</span>
      <EditForm todoid={todo._id} userid={todo.userid} />
      <Deleteform todoid={todo._id} userid={todo.userid} />
    </li>
  );
}
