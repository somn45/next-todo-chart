"use client";

import { addTodo } from "@/actions/addTodo";
import { useActionState } from "react";

export default function TodosForm({ userid }: { userid: string }) {
  const addTodoWithUserId = addTodo.bind(null, userid);
  const [state, formAction] = useActionState(addTodoWithUserId, {
    newTodo: "",
  });

  return (
    <form action={formAction}>
      <input
        type="text"
        placeholder="새 투두리스트 추가"
        name="newTodo"
        aria-label="새 투두리스트"
      />
      <button type="submit">새 투두리스트 추가</button>
    </form>
  );
}
