/**
 * @jest-environment node
 */

jest.mock("@/libs/database");
jest.mock("next/navigation");

import { getTodos } from "@/apis/getTodos";
import { redirect } from "next/navigation";
import * as database from "@/libs/database";
import { IMockDatabase } from "@/libs/__mocks__/database";

const { mockCollection } = database as unknown as IMockDatabase;

const mockTodos = [
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

describe("getTodos API 성공 테스트", () => {
  it("getTodos API 함수는 로그인 중인 사용자의 전체 투두리스트 목록을 반환한다.", async () => {
    (mockCollection.aggregate().toArray as jest.Mock).mockResolvedValue(
      mockTodos,
    );

    const todos = await getTodos("mockuser");
    expect(todos).toEqual(mockTodos);
  });
});

describe("getTodos API 엣지 케이스 테스트", () => {
  it("userid가 없을 경우 로그인 페이지로 리디렉션하는 함수를 호출한다", async () => {
    await getTodos(null);
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
