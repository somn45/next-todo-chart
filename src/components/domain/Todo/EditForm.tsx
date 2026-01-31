"use client";

import { editTodo } from "@/actions/editTodo";
import Button from "@/components/ui/atoms/Button";
import ErrorMessage from "@/components/ui/atoms/ErrorMessage";
import Input from "@/components/ui/atoms/Input";
import { useActionState, useEffect, useState } from "react";

interface EditFormProps {
  todoid: string;
  userid: string;
}

export default function EditForm({ todoid, userid }: EditFormProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const editTodoWithTodoIdAndUserId = editTodo.bind(null, {
    todoid,
    userid,
  });
  const [state, editTodoAction] = useActionState(editTodoWithTodoIdAndUserId, {
    message: "",
  });

  useEffect(() => {
    if (state.message.length === 0) setIsEditMode(false);
  }, [state]);

  if (!isEditMode)
    return (
      <Button type="button" value="수정" onClick={() => setIsEditMode(true)} />
    );
  return (
    <form role="form" action={editTodoAction}>
      <ErrorMessage message={state.message} />
      <Input
        type="text"
        placeholder="투두리스트 수정"
        name="todo"
        ariaLabel="수정될 투두 입력칸"
      />
      <Button type="submit" value="수정 완료" />
      <Button type="button" value="취소" onClick={() => setIsEditMode(false)} />
    </form>
  );
}
