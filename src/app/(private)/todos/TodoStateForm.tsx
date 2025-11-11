"use client";

import { updateTodoState } from "@/actions/updateTodoState";
import { LookupedTodo } from "@/types/schema";
import { useActionState } from "react";

interface TodoStateFormProps {
  todoid: string;
  todoState: "할 일" | "진행 중" | "완료";
}

export default function TodoStateForm({
  todoid,
  todoState,
}: TodoStateFormProps) {
  const updateTodoStateWithTodoId = updateTodoState.bind(null, { todoid });
  const [actionState, formAction] = useActionState(updateTodoStateWithTodoId, {
    message: "",
  });
  return (
    <ul>
      <li>
        <form action={formAction} hidden={todoState === "할 일"}>
          <input type="text" name="state" value="할 일" readOnly hidden />
          <button type="submit">할 일</button>
        </form>
      </li>
      <li>
        <form action={formAction} hidden={todoState === "진행 중"}>
          <input type="text" name="state" value="진행 중" readOnly hidden />
          <button type="submit">진행 중</button>
        </form>
      </li>
      <li>
        <form action={formAction} hidden={todoState === "완료"}>
          <input type="text" name="state" value="완료" readOnly hidden />
          <button type="submit">완료</button>
        </form>
      </li>
    </ul>
  );
}
