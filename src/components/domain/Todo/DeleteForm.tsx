"use client";

import { deleteTodo } from "@/actions/deleteTodo";
import Button from "@/components/ui/atoms/Button";
import Input from "@/components/ui/atoms/Input";
import { useActionState } from "react";

export default function Deleteform({
  todoid,
  userid,
  showDeleteSection = true,
}: {
  todoid: string;
  userid: string;
  showDeleteSection?: boolean;
}) {
  const deleteTodoWithUserId = deleteTodo.bind(null, userid);
  const [state, formAction] = useActionState(deleteTodoWithUserId, {
    message: "",
  });
  if (!showDeleteSection) return null;
  return (
    <form role="form" action={formAction}>
      <span>{state.message}</span>
      <Input
        type="text"
        name="todo-id"
        defaultValue={todoid}
        ariaLabel="삭제할 투두"
        dataTestId="delete-todo-form"
        isHidden={true}
      />
      <Button type="submit" value="삭제" />
    </form>
  );
}
