"use client";

import { editTodo } from "@/actions/editTodo";
import Button from "@/components/ui/atoms/Button";
import ErrorMessage from "@/components/ui/atoms/ErrorMessage";
import Input from "@/components/ui/atoms/Input";
import { MOBILE_MEDIAM_SIZE } from "@/constants/media";
import { CircleCheck, CircleX } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

type EditTodoOptimisticType = {
  type: "edit";
  textField: string;
};

interface EditFormProps {
  todoid: string;
  userid: string;
  hiddenEditForm: () => void;
  editTodoOptimsiticAction: (action: EditTodoOptimisticType) => void;
}

export default function EditTodoForm({
  todoid,
  userid,
  hiddenEditForm,
  editTodoOptimsiticAction,
}: EditFormProps) {
  const editTodoWithTodoIdAndUserId = editTodo.bind(null, {
    todoid,
    userid,
  });
  const [state, editTodoAction] = useActionState(
    async (prevState: { message: string }, formData: FormData) => {
      const editedTextField = formData.get("todo") as string;

      editTodoOptimsiticAction({ type: "edit", textField: editedTextField });

      const result = await editTodoWithTodoIdAndUserId(prevState, formData);
      return result;
    },
    {
      message: "",
    },
  );

  const [windowSize, setWindowSize] = useState(0);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    if (window.innerWidth !== 0) setWindowSize(window.innerWidth);
    if (state.message === "투두 수정 성공") {
      hiddenEditForm();
    }

    window.addEventListener("resize", handleWindowResize);
  }, [state]);

  return (
    <form
      role="form"
      action={editTodoAction}
      aria-label="투두 수정 폼"
      className="flex h-12 items-center gap-2"
    >
      <ErrorMessage message={state.message} successSignal={"투두 수정 성공"} />
      <Input
        type="text"
        placeholder="투두리스트 수정"
        name="todo"
        ariaLabel="수정될 투두 입력칸"
        variant="edit"
      />
      <Button
        type="submit"
        variant="button"
        value={
          windowSize <= MOBILE_MEDIAM_SIZE ? <CircleCheck size={16} /> : "수정"
        }
      />
      <Button
        type="button"
        value={
          windowSize <= MOBILE_MEDIAM_SIZE ? <CircleX size={16} /> : "취소"
        }
        onClick={hiddenEditForm}
      />
    </form>
  );
}
