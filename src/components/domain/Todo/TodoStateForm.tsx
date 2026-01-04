"use client";

import { updateTodoState } from "@/actions/updateTodoState";
import { useActionState } from "react";

interface TodoStateFormProps {
  todoid: string;
  todoState: "할 일" | "진행 중" | "완료";
}

export default function TodoStateForm({
  todoid,
  todoState,
}: TodoStateFormProps) {
  const updateTodoStateWithTodoId = updateTodoState.bind(null, todoid);
  const [actionState, formAction] = useActionState(updateTodoStateWithTodoId, {
    message: "",
  });
  return (
    <ul style={{ display: "flex", gap: "20px", listStyleType: "none" }}>
      <span>{actionState.message}</span>
      <li>
        <form
          action={formAction}
          role="form"
          aria-label="할 일이 포함된 양식"
          hidden={todoState === "할 일"}
        >
          <input
            type="text"
            name="state"
            value="할 일"
            aria-label="할 일"
            readOnly
            hidden
          />
          <button type="submit">할 일</button>
        </form>
      </li>
      <li>
        <form
          action={formAction}
          role="form"
          aria-label="진행 중이 포함된 양식"
          hidden={todoState === "진행 중"}
        >
          <input
            type="text"
            name="state"
            value="진행 중"
            aria-label="진행 중"
            readOnly
            hidden
          />
          <button type="submit">진행 중</button>
        </form>
      </li>
      <li>
        <form
          action={formAction}
          role="form"
          aria-label="완료가 포함된 양식"
          hidden={todoState === "완료"}
        >
          <input
            type="text"
            name="state"
            value="완료"
            aria-label="완료"
            readOnly
            hidden
          />
          <button type="submit">완료</button>
        </form>
      </li>
    </ul>
  );
}
