"use client";

import { editTodo } from "@/actions/editTodo";
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
    return <button onClick={() => setIsEditMode(true)}>수정</button>;
  return (
    <form role="form" action={editTodoAction}>
      <span>{state.message}</span>
      <input
        type="text"
        placeholder="투두리스트 작성"
        name="todo"
        aria-label="수정될 투두"
      />
      <button type="submit">수정 완료</button>
      <button type="button" onClick={() => setIsEditMode(false)}>
        취소
      </button>
    </form>
  );
}
