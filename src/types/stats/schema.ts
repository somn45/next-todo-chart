import { RawTodo } from "../todos/schema";

export interface TodoStat {
  date: Date;
  state: string;
  count: number;
}

export interface SerializedTodoStat {
  date: string;
  state: string;
  count: number;
}

export interface TodoStats {
  date: Date;
  todos: RawTodo[];
}
