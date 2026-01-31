"use client";

import { updateTodoState } from "@/actions/updateTodoState";
import Button from "@/components/ui/atoms/Button";
import ErrorMessage from "@/components/ui/atoms/ErrorMessage";
import Input from "@/components/ui/atoms/Input";
import { useActionState } from "react";

interface TodoStateFormProps {
  todoid: string;
  todoState: "할 일" | "진행 중" | "완료";
}

export default function TodoStateForm({
  todoid,
  todoState,
}: TodoStateFormProps) {
  const updateTodoStateWithTodoId = updateTodoState.bind(null, todoid);
  const [actionState, formAction] = useActionState(updateTodoStateWithTodoId, {
    message: "",
  });
  return (
    <ul style={{ display: "flex", gap: "20px", listStyleType: "none" }}>
      <ErrorMessage message={actionState.message} />
      <li>
        <form
          action={formAction}
          role="form"
          aria-label="할 일이 포함된 양식"
          hidden={todoState === "할 일"}
        >
          <Input
            type="text"
            name="state"
            defaultValue="할 일"
            ariaLabel="할 일 투두 상태"
            isReadOnly={true}
            isHidden={true}
          />
          <Button type="submit" value="할 일" />
        </form>
      </li>
      <li>
        <form
          action={formAction}
          role="form"
          aria-label="진행 중이 포함된 양식"
          hidden={todoState === "진행 중"}
        >
          <Input
            type="text"
            name="state"
            defaultValue="진행 중"
            ariaLabel="진행 중 투두 상태"
            isReadOnly={true}
            isHidden={true}
          />
          <Button type="submit" value="진행 중" />
        </form>
      </li>
      <li>
        <form
          action={formAction}
          role="form"
          aria-label="완료가 포함된 양식"
          hidden={todoState === "완료"}
        >
          <Input
            type="text"
            name="state"
            defaultValue="완료"
            ariaLabel="완료 투두 상태"
            isReadOnly={true}
            isHidden={true}
          />
          <Button type="submit" value="완료" />
        </form>
      </li>
    </ul>
  );
}
