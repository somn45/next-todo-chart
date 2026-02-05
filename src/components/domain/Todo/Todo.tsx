"use client";

import { ClientTodo } from "@/types/schema";
import { useRef } from "react";
import Text from "@/components/ui/atoms/Text";
import ErrorMessage from "@/components/ui/atoms/ErrorMessage";
import EditTodoForm from "@/components/ui/organisms/EditTodoForm";
import DeleteTodoform from "@/components/ui/organisms/DeleteTodoForm";
import SelectTodoStateForm from "@/components/ui/organisms/SelectTodoStateForm";
import useGraceTimeAlertMessage from "@/hooks/useGraceTimeAlertMessage";

// 캐시 무효화가 되지 않아 완료 상태면서 유예 시간이 지난 투두가 보이는 현상 발생

export default function Todo({
  todo,
  showDeleteSection,
}: {
  todo: ClientTodo;
  showDeleteSection?: boolean;
}) {
  const { _id, userid, textField, state, completedAt } = todo;
  const deleteCompletedTodoTimerId = useRef<NodeJS.Timeout | null>(null);

  const { hasGracePeriod, alertMessage } = useGraceTimeAlertMessage(
    state,
    deleteCompletedTodoTimerId,
    completedAt,
  );

  return (
    <li
      style={{
        display: hasGracePeriod || state !== "완료" ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      <ErrorMessage message={alertMessage} />
      <Text content={textField} dataTestId="todo-textfield" />
      <Text content={`현재 상태 ${state}`} dataTestId="todo-state" />
      <SelectTodoStateForm todoid={_id} currentTodoState={state} />
      <EditTodoForm todoid={_id} userid={userid} />
      <DeleteTodoform
        todoid={_id}
        userid={userid}
        showDeleteSection={showDeleteSection}
      />
    </li>
  );
}
