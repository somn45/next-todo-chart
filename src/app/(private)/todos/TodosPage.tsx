"use client";

import { ObjectId } from "bson";
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
      const fakeTodosId = new ObjectId().toString();
      const fakeTodoId = new ObjectId().toString();
      const newTodo: TodosType & SerializedTodo = {
        _id: fakeTodosId,
        author: userId,
        content: {
          _id: fakeTodoId,
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
    <section className="container">
      <h2 className="text-heading">TodoList</h2>
      <AddTodoForm userId={userId} addTodoAction={addOptimisticTodo} />
      <ul
        aria-label="투두 목록"
        className="flex flex-col gap-x-20 gap-y-8 lg:grid lg:grid-cols-2 2xl:grid-cols-3"
      >
        {optimisiticTodos.map(todo => (
          <TodoWrapper key={todo.content._id} todo={todo.content} />
        ))}
      </ul>
    </section>
  );
}
