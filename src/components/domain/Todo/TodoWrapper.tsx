"use client";

import { ClientTodo, LookupedTodo } from "@/types/schema";
import { ErrorBoundary } from "react-error-boundary";
import TodoFallback from "./TodoFallback";
import Todo from "./Todo";

// 나중에 showDeleteSection props drilling 문제 해결
export default function TodoWrapper({
  todo,
  showDeleteSection,
}: {
  todo: ClientTodo;
  showDeleteSection?: boolean;
}) {
  console.log(typeof todo.updatedAt);
  return (
    <ErrorBoundary FallbackComponent={TodoFallback}>
      <Todo todo={todo} showDeleteSection={showDeleteSection} />
    </ErrorBoundary>
  );
}
