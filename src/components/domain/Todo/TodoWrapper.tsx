"use client";

import { ErrorBoundary } from "react-error-boundary";
import TodoFallback from "./TodoFallback";
import Todo from "./Todo";
import { SerializedTodo } from "@/types/todos/schema";

// 나중에 showDeleteSection props drilling 문제 해결
export default function TodoWrapper({
  todo,
  showDeleteSection,
}: {
  todo: SerializedTodo["content"];
  showDeleteSection?: boolean;
}) {
  return (
    <ErrorBoundary FallbackComponent={TodoFallback}>
      <Todo todo={todo} showDeleteSection={showDeleteSection} />
    </ErrorBoundary>
  );
}
