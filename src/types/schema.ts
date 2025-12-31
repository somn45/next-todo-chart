import { ObjectId, WithId } from "mongodb";

export type WithStringifyId = {
  _id: string;
};

export interface ITodo {
  userid: string;
  textField: string;
  state: "할 일" | "진행 중" | "완료";
  createdAt: string;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface LookupedTodo {
  author: string;
  content: WithStringifyId & ITodo;
}

export interface LookupedTodoWithObjectId {
  author: string;
  content: WithStringifyId & { _id: ObjectId };
}

export interface ITodos {
  author: string;
  content: ObjectId[];
}

export interface TodoStats {
  date: Date;
  todos: (ITodo | WithStringifyId)[];
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
