"use client";

import { useOptimistic, useRef } from "react";
import Text from "@/components/ui/atoms/Text";
import ErrorMessage from "@/components/ui/atoms/ErrorMessage";
import EditTodoForm from "@/components/ui/organisms/EditTodoForm";
import DeleteTodoform from "@/components/ui/organisms/DeleteTodoForm";
import SelectTodoStateForm from "@/components/ui/organisms/SelectTodoStateForm";
import useGraceTimeAlertMessage from "@/hooks/useGraceTimeAlertMessage";
import { SerializedTodo, StateType } from "@/types/todos/schema";

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

  return (
    <li
      style={{
        display: hasGracePeriod || todo.state !== "완료" ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      <ErrorMessage message={alertMessage} />
      <Text content={optimisticTodo.textField} dataTestId="todo-textfield" />
      <Text
        content={`현재 상태 ${optimisticTodo.state}`}
        dataTestId="todo-state"
      />
      <SelectTodoStateForm
        todoid={optimisticTodo._id}
        currentTodoState={optimisticTodo.state}
        updateStateOptimisticAction={optimisticTodoAction}
      />
      <EditTodoForm
        todoid={optimisticTodo._id}
        userid={optimisticTodo.userid}
        editTodoOptimsiticAction={optimisticTodoAction}
      />
      <DeleteTodoform
        todoid={optimisticTodo._id}
        userid={optimisticTodo.userid}
        showDeleteSection={showDeleteSection}
        deleteTodoOptimisticAction={optimisticTodoAction}
      />
    </li>
  );
}
