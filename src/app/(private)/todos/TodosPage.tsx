"use client";

import TodoWrapper from "@/components/domain/Todo/TodoWrapper";
import AddTodoForm from "@/components/ui/organisms/AddTodoForm";
import { SerializedTodo, TodosType } from "@/types/todos/schema";
import { useOptimistic } from "react";

interface TodosPageProps {
  userId: string;
  todos: (TodosType & SerializedTodo)[];
}

export default function TodosPage({ userId, todos }: TodosPageProps) {
  const [optimisiticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, textField: string) => {
      const newTodo: TodosType & SerializedTodo = {
        _id: "1",
        author: userId,
        content: {
          _id: "1",
          userid: userId,
          textField,
          state: "할 일",
          createdAt: new Date(Date.now()).toISOString(),
          updatedAt: new Date(Date.now()).toISOString(),
          completedAt: null,
        },
      };
      const newTodos = [...currentTodos, newTodo];
      return newTodos;
    },
  );

  return (
    <section>
      <h2>Todos 페이지</h2>
      <AddTodoForm userId={userId} addTodoAction={addOptimisticTodo} />
      <ul>
        {optimisiticTodos.map(todo => (
          <TodoWrapper key={todo.content._id} todo={todo.content} />
        ))}
      </ul>
    </section>
  );
}
