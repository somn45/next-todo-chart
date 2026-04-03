"use client";

import { addTodo } from "@/actions/addTodo";
import { useActionState, useEffect, useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

interface AddTodoFormProps {
  userId: string;
  addTodoAction: (action: string) => void;
}

export default function AddTodoForm({
  userId,
  addTodoAction,
}: AddTodoFormProps) {
  const addTodoWithUserId = addTodo.bind(null, userId);
  const [state, formAction] = useActionState(addTodoWithUserId, {
    message: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setError(state.message);
  }, [state]);

  const handleSubmit = async (formData: FormData) => {
    const todoFormData = formData.get("newTodo") as string;
    try {
      addTodoAction(todoFormData);

      formAction(formData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      console.error(error);
    }
  };

  return (
    <form role="form" action={handleSubmit}>
      <span>{error}</span>
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
