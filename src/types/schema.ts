import { RawTodo } from "./todos/schema";

export interface TodoStats {
  date: Date;
  todos: RawTodo[];
}

export interface Stat {
  doingStateCount: number;
  doneStateCount: number;
  todoStateCount: number;
  totalCount: number;
  _id: Date;
}

export interface StatStringifyId {
  doingStateCount: number;
  doneStateCount: number;
  todoStateCount: number;
  totalCount: number;
  _id: string;
}

export interface ILineGraphData {
  date: Date;
  state: string;
  count: number;
}
