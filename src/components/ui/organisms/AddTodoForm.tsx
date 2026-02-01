"use client";

import { addTodo } from "@/actions/addTodo";
import { useActionState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

export default function AddTodoForm({ userid }: { userid: string }) {
  const addTodoWithUserId = addTodo.bind(null, userid);
  const [state, formAction] = useActionState(addTodoWithUserId, {
    message: "",
  });

  return (
    <form role="form" action={formAction}>
      <span>{state.message}</span>
      <Input
        type="text"
        placeholder="새 투두리스트 추가"
        name="newTodo"
        ariaLabel="새 투두리스트 입력칸"
      />
      <Button type="submit" value="새 투두리스트 추가" />
    </form>
  );
}
