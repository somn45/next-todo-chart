"use client";

import EditForm from "./EditForm";
import Deleteform from "./DeleteForm";
import { LookupedTodo } from "@/types/schema";
import TodoStateForm from "./TodoStateForm";

export default function Todo({
  _id,
  userid,
  textField,
  state,
}: LookupedTodo["content"]) {
  return (
    <li>
      <span data-testid="todo-textField">{textField}</span>
      <span>현재 상태 {state}</span>
      <TodoStateForm todoid={_id} todoState={state} />
      <EditForm todoid={_id} userid={userid} />
      <Deleteform todoid={_id} userid={userid} />
    </li>
  );
}
