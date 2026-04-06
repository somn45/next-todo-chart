"use client";

import { updateTodoState } from "@/actions/updateTodoState";
import ErrorMessage from "@/components/ui/atoms/ErrorMessage";
import SelectField from "@/components/ui/molecules/SelectField";
import { StateType } from "@/types/todos/schema";
import { useActionState } from "react";

type UpdateTodoStateOptimisticType = {
  type: "state";
  updatedState: StateType;
};

interface TodoStateFormProps {
  todoid: string;
  currentTodoState: "할 일" | "진행 중" | "완료";
  updateStateOptimisticAction: (action: UpdateTodoStateOptimisticType) => void;
}

const TODO_STATE_TYPES = ["할 일", "진행 중", "완료"];

export default function SelectTodoStateForm({
  todoid,
  currentTodoState,
  updateStateOptimisticAction,
}: TodoStateFormProps) {
  const updateTodoStateWithTodoId = updateTodoState.bind(null, todoid);
  const [actionState, formAction] = useActionState(updateTodoStateWithTodoId, {
    message: "",
  });

  const handleSubmit = async (formData: FormData) => {
    const updatedState = formData.get("state") as StateType;
    try {
      updateStateOptimisticAction({ type: "state", updatedState });

      formAction(formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ul style={{ display: "flex", gap: "20px", listStyleType: "none" }}>
      <ErrorMessage message={actionState.message} />
      {TODO_STATE_TYPES.map(todoStateType => (
        <li key={todoStateType}>
          <SelectField
            formAttr={{
              action: handleSubmit,
              ariaLabel: `${todoStateType}이 포함된 양식`,
              isHidden: todoStateType === currentTodoState,
            }}
            inputAttr={{
              type: "text",
              name: "state",
              defaultValue: todoStateType,
              ariaLabel: `${todoStateType} 투두 상태`,
            }}
            buttonAttr={{ value: todoStateType }}
          />
        </li>
      ))}
    </ul>
  );
}
