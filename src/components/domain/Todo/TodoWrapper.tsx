"use client";

import { LookupedTodo } from "@/types/schema";
import { ErrorBoundary } from "react-error-boundary";
import TodoFallback from "./TodoFallback";
import Todo from "./Todo";

export default function TodoWrapper({
  todo,
}: {
  todo: LookupedTodo["content"];
}) {
  return (
    <ErrorBoundary FallbackComponent={TodoFallback}>
      <Todo todo={todo} />
    </ErrorBoundary>
  );
}
