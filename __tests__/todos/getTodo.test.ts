/**
 * @jest-environment node
 */

jest.mock("@/libs/database");
jest.mock("next/navigation");

import { getTodo } from "@/apis/getTodo";
import { redirect } from "next/navigation";
import * as database from "@/libs/database";
import { IMockDatabase } from "@/libs/__mocks__/database";

const { mockCollection } = database as unknown as IMockDatabase;

const mockTodo = {
  _id: "123456789012345678901234",
  userid: "mockuser",
  textField: "hello world!",
};

describe("getTodo API 성공 테스트", () => {
  it("getTodo API에서 todo ID를 받고 해당 ID와 매치되는 단일 투두 객체를 반환한다. ", async () => {
    (mockCollection.aggregate().next as jest.Mock).mockResolvedValue(mockTodo);

    const todo = await getTodo("mockuser", "123456789012345678901234");
    expect(todo).toEqual(mockTodo);
  });
});

describe("getTodo API 엣지 케이스 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("userid가 없을 경우 로그인 페이지로 리디렉션하는 함수를 호출한다.", async () => {
    await getTodo(null, "123456789012345678901234");
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");

    expect(mockCollection.aggregate).not.toHaveBeenCalled();
  });

  it("todoid이 없거나 ObjectId 할당에 적절한 타입이 아닌 경우 ObjectId 타입 유효하지 않음 에러를 던진다.", async () => {
    const invalidObjectIdTypeTodoid = "22";
    await expect(
      getTodo("mockuser", invalidObjectIdTypeTodoid),
    ).rejects.toThrow(`Invalid ObjectId Type ${invalidObjectIdTypeTodoid}`);

    expect(mockCollection.aggregate).not.toHaveBeenCalled();
  });

  it("DB에서 예상치 못한 에러가 발생했을 경우 ", async () => {
    (mockCollection.aggregate().next as jest.Mock).mockImplementation(() => {
      throw new Error("MongoDB Connect is failed");
    });

    await expect(
      getTodo("mockuser", "123456789012345678901234"),
    ).rejects.toThrow("MongoDB Connect is failed");
  });
});
