"use client";

import { useOptimistic, useRef, useState } from "react";
import ErrorMessage from "@/components/ui/atoms/ErrorMessage";
import DeleteTodoform from "@/components/ui/organisms/DeleteTodoForm";
import SelectTodoStateForm from "@/components/ui/organisms/SelectTodoStateForm";
import useGraceTimeAlertMessage from "@/hooks/useGraceTimeAlertMessage";
import { SerializedTodo, StateType } from "@/types/todos/schema";
import { SquarePen } from "lucide-react";
import Button from "@/components/ui/atoms/Button";
import EditableText from "@/components/ui/organisms/EditableText";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";

// 캐시 무효화가 되지 않아 완료 상태면서 유예 시간이 지난 투두가 보이는 현상 발생

type EditTodoOptimisticType = {
  type: "edit";
  textField: string;
};

type DeleteTodoOptimisticType = {
  type: "delete";
};

type UpdateTodoStateOptimisticType = {
  type: "state";
  updatedState: StateType;
};

type TodoOptimisitcActionType =
  | EditTodoOptimisticType
  | DeleteTodoOptimisticType
  | UpdateTodoStateOptimisticType;

const AFTER_TEN_MINUTES = 1000 * 60 * 10;

export default function Todo({
  todo,
  showDeleteSection,
}: {
  todo: SerializedTodo["content"];
  showDeleteSection?: boolean;
}) {
  const deleteCompletedTodoTimerId = useRef<NodeJS.Timeout | null>(null);

  const [optimisticTodo, optimisticTodoAction] = useOptimistic(
    todo,
    (currentTodo, action: TodoOptimisitcActionType) => {
      switch (action.type) {
        case "edit":
          const editedTodo = { ...currentTodo, textField: action.textField };
          return editedTodo;
        case "delete":
          const deleteTodo = { ...currentTodo, isDeleted: true };
          return deleteTodo;
        case "state":
          const completedAt =
            action.updatedState === "완료"
              ? new Date(Date.now() + AFTER_TEN_MINUTES).toISOString()
              : null;

          const updatedStateTodo = {
            ...currentTodo,
            state: action.updatedState,
            completedAt,
          };
          return updatedStateTodo;
      }
    },
  );

  const { hasGracePeriod, alertMessage } = useGraceTimeAlertMessage(
    optimisticTodo.state,
    deleteCompletedTodoTimerId,
    optimisticTodo.completedAt,
  );

  const TodoHighlistColor: { [key: string]: string } = {
    "할 일": "border-[#3498DB]",
    "진행 중": "border-[#FFA500]",
    완료: "border-[#2ECC71]",
  };

  const [displayedEditForm, setDisplayedEditForm] = useState(false);

  console.log(showDeleteSection);

  if (!hasGracePeriod && todo.state === "완료") return null;
  return (
    <li
      className={`${TodoHighlistColor[todo.state]} flex max-w-md flex-col gap-2 rounded-md border-l-4 pl-4`}
    >
      <ErrorMessage message={alertMessage} />
      <EditableText
        todo={optimisticTodo}
        displayedEditForm={displayedEditForm}
        hiddenEditForm={() => setDisplayedEditForm(false)}
        optimisticTodoAction={optimisticTodoAction}
      />
      <div className="flex items-center gap-4">
        <span className="text-caption">
          {formatByISO8601(new Date(optimisticTodo.createdAt))}
        </span>
        <div className="flex items-center justify-center rounded-md p-1 hover:bg-mauve-400">
          <Button
            type="button"
            value={<SquarePen size={16} />}
            onClick={() => setDisplayedEditForm(true)}
          />
        </div>
        <DeleteTodoform
          todoid={optimisticTodo._id}
          userid={optimisticTodo.userid}
          showDeleteSection={showDeleteSection}
          deleteTodoOptimisticAction={optimisticTodoAction}
        />
      </div>
      <SelectTodoStateForm
        todoid={optimisticTodo._id}
        currentTodoState={optimisticTodo.state}
        updateStateOptimisticAction={optimisticTodoAction}
      />
    </li>
  );
}
