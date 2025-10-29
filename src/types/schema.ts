import { ObjectId, WithId } from "mongodb";

export interface ITodo {
  userid: string;
  textField: string;
}

export interface LookupedTodo {
  author: string;
  content: WithId<ITodo>;
}

export interface ITodos {
  author: string;
  content: ObjectId[];
}
