/**
 * @jest-environment node
 */

import { getTodo } from "@/apis/getTodo";
import { mockTodo } from "../../__mocks__/todos";

jest.mock("@/libs/database", () => {
  const mockTodo = {
    _id: "123456789012345678901234",
    userid: "mockuser",
    textField: "hello world!",
  };

  const mockAggregate = {
    next: jest.fn().mockResolvedValue(mockTodo),
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

describe("getTodo API", () => {
  it("getTodo API에서 todo ID를 받고 해당 ID와 매치되는 단일 투두 객체를 반환한다. ", async () => {
    const todo = await getTodo("mockuser", "123456789012345678901234");
    expect(todo).toEqual(mockTodo);
  });
});
