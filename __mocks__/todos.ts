import { WithStringifyId } from "@/types/schema";

interface Todo {
  userid: string;
  textField: string;
  state: "할 일" | "진행 중" | "완료";
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

interface LookupedTodo {
  author: string;
  content: WithStringifyId & Todo;
}

export const mockTodos: (LookupedTodo & WithStringifyId)[] = [
  {
    _id: "1",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "mockuser",
      textField: "mock text",
      state: "완료",
      createdAt: new Date(2025, 6, 10).toISOString(),
      updatedAt: new Date(2025, 6, 12).toISOString(),
      completedAt: new Date(2025, 6, 15).toISOString(),
    },
  },
  {
    _id: "2",
    author: "mockuser",
    content: {
      _id: "2",
      userid: "mockuser",
      textField: "hello world",
      state: "진행 중",
      createdAt: new Date(2025, 6, 13).toISOString(),
      updatedAt: new Date(2025, 6, 14).toISOString(),
      completedAt: null,
    },
  },
];

export const mockTodo = {
  _id: "123456789012345678901234",
  userid: "mockuser",
  textField: "hello world!",
};
