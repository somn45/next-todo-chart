"use client";

import { editTodo } from "@/actions/editTodo";
import Button from "@/components/ui/atoms/Button";
import ErrorMessage from "@/components/ui/atoms/ErrorMessage";
import Input from "@/components/ui/atoms/Input";
import useEditMode from "@/hooks/useEditMode";
import { useActionState } from "react";

type EditTodoOptimisticType = {
  type: "edit";
  textField: string;
};

interface EditFormProps {
  todoid: string;
  userid: string;
  editTodoOptimsiticAction: (action: EditTodoOptimisticType) => void;
}

export default function EditTodoForm({
  todoid,
  userid,
  editTodoOptimsiticAction,
}: EditFormProps) {
  const editTodoWithTodoIdAndUserId = editTodo.bind(null, {
    todoid,
    userid,
  });
  const [state, editTodoAction] = useActionState(editTodoWithTodoIdAndUserId, {
    message: "",
  });
  const [isEditMode, setEditMode, setReadMode] = useEditMode(state.message);

  const handleSubmit = async (FormData: FormData) => {
    const editedTextField = FormData.get("todo") as string;
    try {
      editTodoOptimsiticAction({ type: "edit", textField: editedTextField });

      editTodoAction(FormData);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isEditMode)
    return <Button type="button" value="수정" onClick={setEditMode} />;
  return (
    <form role="form" action={handleSubmit}>
      <ErrorMessage message={state.message} successSignal={"투두 수정 성공"} />
      <Input
        type="text"
        placeholder="투두리스트 수정"
        name="todo"
        ariaLabel="수정될 투두 입력칸"
      />
      <Button type="submit" value="수정 완료" />
      <Button type="button" value="취소" onClick={setReadMode} />
    </form>
  );
}
