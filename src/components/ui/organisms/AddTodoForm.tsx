"use client";

import { addTodo } from "@/actions/addTodo";
import { useActionState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Search } from "lucide-react";

interface AddTodoFormProps {
  userId: string;
  addTodoAction: (action: string) => void;
}

export default function AddTodoForm({
  userId,
  addTodoAction,
}: AddTodoFormProps) {
  const addTodoWithUserId = addTodo.bind(null, userId);
  const [state, formAction] = useActionState(
    async (prevState: { message: string }, formData: FormData) => {
      const todoFormData = formData.get("newTodo") as string;

      addTodoAction(todoFormData);

      const result = await addTodoWithUserId(prevState, formData);
      return result;
    },
    {
      message: "",
    },
  );

  return (
    <form
      role="form"
      action={formAction}
      className="relative h-16 max-w-lg py-2"
    >
      <span>{state.message}</span>
      <Input
        type="text"
        placeholder="새 투두리스트 추가"
        name="newTodo"
        ariaLabel="새 투두리스트 입력칸"
        variant="searchBar"
      />
      <Button
        type="submit"
        value={<Search />}
        ariaLabel="새 투두 추가"
        variant="searchBar"
      />
    </form>
  );
}
