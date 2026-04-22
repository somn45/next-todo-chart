import { editTodo } from "@/actions/editTodo";
import { SerializedTodo } from "@/types/todos/schema";
import EditTodoForm from "./EditTodoForm";

type EditTodoOptimisticType = {
  type: "edit";
  textField: string;
};

interface EditableTextProps {
  todo: SerializedTodo["content"];
  displayedEditForm: boolean;
  hiddenEditForm: () => void;
  optimisticTodoAction: (action: EditTodoOptimisticType) => void;
}

export default function EditableText({
  todo,
  displayedEditForm,
  hiddenEditForm,
  optimisticTodoAction,
}: EditableTextProps) {
  if (displayedEditForm) {
    return (
      <EditTodoForm
        todoid={todo._id}
        userid={todo.userid}
        hiddenEditForm={hiddenEditForm}
        editTodoOptimsiticAction={optimisticTodoAction}
      />
    );
  }
  return (
    <div className="flex h-12 items-center">
      <span className="text-regular">{todo.textField}</span>
    </div>
  );
}
