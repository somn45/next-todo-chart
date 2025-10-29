"use client";

import { deleteTodo } from "@/actions/deleteTodo";
import { useActionState } from "react";

export default function Deleteform({
  todoid,
  userid,
}: {
  todoid: string;
  userid: string;
}) {
  const deleteTodoWithUserId = deleteTodo.bind(null, userid);
  const [state, formAction] = useActionState(deleteTodoWithUserId, {
    message: "",
  });
  return (
    <form action={formAction}>
      <input
        type="text"
        name="todoid"
        value={todoid}
        onChange={() => {}}
        aria-label="삭제할 투두"
        hidden
      />
      <button type="submit">삭제</button>
    </form>
  );
}
