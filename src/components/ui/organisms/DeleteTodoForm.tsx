"use client";

import { deleteTodo } from "@/actions/deleteTodo";
import Button from "@/components/ui/atoms/Button";
import ErrorMessage from "@/components/ui/atoms/ErrorMessage";
import Input from "@/components/ui/atoms/Input";
import { Trash } from "lucide-react";
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
  const [state, formAction] = useActionState(
    async (prevState: { message: string }, formData: FormData) => {
      deleteTodoOptimisticAction({ type: "delete" });

      const result = await deleteTodoWithUserId(prevState, formData);
      return result;
    },
    {
      message: "",
    },
  );
  if (!showDeleteSection) return null;

  return (
    <form role="form" action={formAction}>
      <ErrorMessage message={state.message} />
      <Input
        type="text"
        name="todo-id"
        defaultValue={todoid}
        ariaLabel="삭제할 투두"
        dataTestId="delete-todo-form"
        isHidden={true}
      />
      <div className="flex items-center justify-center rounded-md bg-red-400 p-1 hover:bg-red-600">
        <Button
          type="submit"
          value={<Trash size={16} />}
          ariaLabel="투두 삭제 버튼"
        />
      </div>
    </form>
  );
}
