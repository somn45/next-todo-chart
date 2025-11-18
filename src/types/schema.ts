import { ObjectId, WithId } from "mongodb";

export type WithStringifyId = {
  _id: string;
};

export interface ITodo {
  userid: string;
  textField: string;
  state: "할 일" | "진행 중" | "완료";
  createdAt: string;
  updatedAt: string;
  completedAt: Date;
}

export interface LookupedTodo {
  author: string;
  content: WithStringifyId & ITodo;
}

export interface ITodos {
  author: string;
  content: ObjectId[];
}
