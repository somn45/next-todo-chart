"use client";

import EditForm from "./EditForm";
import Deleteform from "./DeleteForm";
import { LookupedTodo } from "@/types/schema";
import TodoStateForm from "./TodoStateForm";
import { useEffect, useRef, useState } from "react";

// 6시 20분 완료인데 6시 14분일 경우

export default function Todo({ todo }: { todo: LookupedTodo["content"] }) {
  console.log(todo);
  const { _id, userid, textField, state, completedAt } = todo;

  const [hasGracePeriod, setHasGracePeriod] = useState(true);
  const [message, setMessage] = useState("");

  const deleteCompletedTodoTimerId = useRef<NodeJS.Timeout | null>(null);

  const deleteTodo = () => {
    setHasGracePeriod(false);
    setMessage("");
  };

  useEffect(() => {
    const completedDate = new Date(completedAt);
    const gracePeriod = completedDate.getTime() - Date.now();

    if (state !== "완료" && deleteCompletedTodoTimerId.current) {
      clearTimeout(deleteCompletedTodoTimerId.current);
      setHasGracePeriod(false);
      setMessage("");
    }

    if (completedDate.getFullYear() >= new Date().getFullYear()) {
      if (completedDate && completedDate.getTime() >= Date.now()) {
        setMessage(
          `이 할 일은 완료 상태입니다. ${completedDate} 까지 완료 상태 지속 시 영구히 완료 상태가 됩니다.`,
        );
        setHasGracePeriod(true);

        deleteCompletedTodoTimerId.current = setTimeout(
          () => deleteTodo(),
          gracePeriod,
        );
      }
    }
  }, [completedAt, state]);

  return (
    <li
      style={{ display: hasGracePeriod || state !== "완료" ? "block" : "none" }}
    >
      <p>{message}</p>
      <span data-testid="todo-textField">{textField}</span>
      <span data-testid="todo-state">현재 상태 {state}</span>
      <TodoStateForm todoid={_id} todoState={state} />
      <EditForm todoid={_id} userid={userid} />
      <Deleteform todoid={_id} userid={userid} />
    </li>
  );
}
