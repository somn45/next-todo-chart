"use client";

import { deleteTodo } from "@/actions/deleteTodo";
import Button from "@/components/ui/atoms/Button";
import ErrorMessage from "@/components/ui/atoms/ErrorMessage";
import Input from "@/components/ui/atoms/Input";
import { useActionState } from "react";

type DeleteTodoOptimisticType = {
  type: "delete";
};

export default function DeleteTodoform({
  todoid,
  userid,
  showDeleteSection = true,
  deleteTodoOptimisticAction,
}: {
  todoid: string;
  userid: string;
  showDeleteSection?: boolean;
  deleteTodoOptimisticAction: (action: DeleteTodoOptimisticType) => void;
}) {
  const deleteTodoWithUserId = deleteTodo.bind(null, userid);
  const [state, formAction] = useActionState(deleteTodoWithUserId, {
    message: "",
  });
  if (!showDeleteSection) return null;

  const handleSubmit = (formData: FormData) => {
    try {
      deleteTodoOptimisticAction({ type: "delete" });

      formAction(formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form role="form" action={handleSubmit}>
      <ErrorMessage message={state.message} />
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
