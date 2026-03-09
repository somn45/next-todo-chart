import { ObjectId } from "mongodb";

export type WithStringifyId = {
  _id: string;
};

export interface TodosType {
  _id: string;
  author: string;
}

export interface TodoRefer {
  content: ObjectId[];
}

export interface RawTodo {
  content: {
    _id: ObjectId;
    userid: string;
    textField: string;
    state: "할 일" | "진행 중" | "완료";
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date | null;
  };
}

export interface SerializedTodo {
  content: {
    _id: string;
    userid: string;
    textField: string;
    state: "할 일" | "진행 중" | "완료";
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
  };
}
