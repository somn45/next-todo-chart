/**
 * @jest-environment node
 */

import { getTodos } from "@/apis/getTodos";
import { mockTodos } from "../../__mocks__/todos";

jest.mock("@/libs/database", () => {
  const mockTodos = [
    {
      _id: "1",
      author: "mockuser",
      content: {
        _id: "1",
        userid: "mockuser",
        textField: "mock text",
      },
    },
    {
      _id: "2",
      author: "mockuser",
      content: {
        _id: "2",
        userid: "mockuser",
        textField: "hello world",
      },
    },
  ];

  const mockAggregate = {
    toArray: jest.fn().mockResolvedValue(mockTodos),
  };
  const mockCollection = {
    aggregate: jest.fn().mockReturnValue(mockAggregate),
  };
  const mockDb = {
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    }),
  };
  return {
    connectDB: Promise.resolve(mockDb),
  };
});

describe("getTodos API", () => {
  it("getTodos API 함수에서 로그인 중인 사용자의 전체 투두리스트 목록을 반환한다.", async () => {
    const todos = await getTodos("mockuser");
    expect(todos).toEqual(mockTodos);
  });
});
