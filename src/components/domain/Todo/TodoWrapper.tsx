"use client";

import { LookupedTodo } from "@/types/schema";
import { ErrorBoundary } from "react-error-boundary";
import TodoFallback from "./TodoFallback";
import Todo from "./Todo";

// 나중에 showDeleteSection props drilling 문제 해결
export default function TodoWrapper({
  todo,
  showDeleteSection,
}: {
  todo: LookupedTodo["content"];
  showDeleteSection?: boolean;
}) {
  return (
    <ErrorBoundary FallbackComponent={TodoFallback}>
      <Todo todo={todo} showDeleteSection={showDeleteSection} />
    </ErrorBoundary>
  );
}
