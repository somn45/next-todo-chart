import { ObjectId } from "mongodb";
import EditForm from "./EditForm";
import { unstable_cache } from "next/cache";
import { getTodo } from "@/apis/getTodo";
import Deleteform from "./DeleteForm";

interface TodoComponentProps {
  _id: ObjectId;
  userid: string;
  textField: string;
}

export default async function TodoPage({ _id, userid }: TodoComponentProps) {
  const getCachedTodo = unstable_cache(
    async () => {
      return await getTodo(userid, _id);
    },
    [`${_id}'s todo`],
    {
      tags: [`todo-${_id}`],
      revalidate: 3600,
    },
  );
  const todo = await getCachedTodo();

  if (!todo) return <li>등록된 투두리스트가 없습니다.</li>;
  return (
    <li>
      <span>{todo.userid}</span>
      <span>{todo.textField}</span>
      <EditForm todoid={todo._id.toString()} userid={todo.userid} />
      <Deleteform todoid={todo._id.toString()} userid={todo.userid} />
    </li>
  );
}
