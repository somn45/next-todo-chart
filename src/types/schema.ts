import { ObjectId, WithId } from "mongodb";

export type WithStringifyId = {
  _id: string;
};

export interface ITodo {
  userid: string;
  textField: string;
}

export interface LookupedTodo {
  author: string;
  content: WithStringifyId & ITodo;
}

export interface ITodos {
  author: string;
  content: ObjectId[];
}
