"use client";

import { addTodo } from "@/actions/addTodo";
import { useActionState } from "react";
import TodosForm from "./Form";

export default function Todos() {
  const [state, formAction] = useActionState(addTodo, { newTodo: "" });
  return (
    <section>
      <h2>Todos 페이지</h2>
      <TodosForm serverAction={formAction} initialState={state} />
      <ul>
        <li>{state.newTodo}</li>
      </ul>
    </section>
  );
}
