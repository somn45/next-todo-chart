/**
 * @jest-environment node
 */

import { getTodo } from "@/apis/getTodo";
import { mockTodo } from "../../__mocks__/todos";
import { redirect } from "next/navigation";
import { connectDB } from "@/libs/database";

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
jest.mock("next/navigation");

describe("getTodo API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("getTodo API에서 todo ID를 받고 해당 ID와 매치되는 단일 투두 객체를 반환한다. ", async () => {
    const todo = await getTodo("mockuser", "123456789012345678901234");
    expect(todo).toEqual(mockTodo);
  });

  it("userid가 없을 경우 로그인 페이지로 리디렉션하는 함수를 호출한다.", async () => {
    await getTodo(null, "123456789012345678901234");
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");

    const db = (await connectDB).db("next-todo-chart-cluster");
    expect(db.collection("todo").aggregate).not.toHaveBeenCalled();
  });

  it("todoid이 없거나 ObjectId 할당에 적절한 타입이 아닌 경우 ObjectId 타입 유효하지 않음 에러를 던진다.", async () => {
    const invalidObjectIdTypeTodoid = "22";
    await expect(
      getTodo("mockuser", invalidObjectIdTypeTodoid),
    ).rejects.toThrow(`Invalid ObjectId Type ${invalidObjectIdTypeTodoid}`);

    const db = (await connectDB).db("next-todo-chart-cluster");
    expect(db.collection("todo").aggregate).not.toHaveBeenCalled();
  });

  it("DB에서 예상치 못한 에러가 발생했을 경우 ", async () => {
    const db = (await connectDB).db("next-todo-chart-cluster");
    (db.collection("todo").aggregate as jest.Mock).mockImplementation(() => {
      throw new Error("MongoDB Connect is failed");
    });

    await expect(
      getTodo("mockuser", "123456789012345678901234"),
    ).rejects.toThrow("MongoDB Connect is failed");
  });
});
