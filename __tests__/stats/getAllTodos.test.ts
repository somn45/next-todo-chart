jest.mock("@/libs/database");
jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("mockuser"),
  }),
}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

import { getAllTodos } from "@/apis/getAllTodos";
import { SerializedTodo, TodosType } from "@/types/todos/schema";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as database from "@/libs/database";
import { IMockDatabase } from "@/libs/__mocks__/database";

const { mockCollection } = database as unknown as IMockDatabase;

const mockTodos: Array<TodosType & SerializedTodo> = [
  {
    _id: "1",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "mockuser",
      textField: "테스트 코드 작성",
      state: "진행 중",
      createdAt: new Date(2025, 6, 1).toString(),
      updatedAt: new Date(2025, 6, 5).toUTCString(),
      completedAt: new Date(2025, 6, 5).toUTCString(),
    },
  },
  {
    _id: "2",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "testing",
      textField: "디자인 추가",
      state: "할 일",
      createdAt: new Date(2025, 6, 3).toString(),
      updatedAt: new Date(2025, 6, 7).toUTCString(),
      completedAt: null,
    },
  },
  {
    _id: "3",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "mockuser",
      textField: "주간 회의 일지 작성",
      state: "완료",
      createdAt: new Date(2025, 5, 30).toString(),
      updatedAt: new Date(2025, 6, 3).toUTCString(),
      completedAt: new Date(2025, 6, 3).toUTCString(),
    },
  },
];

describe("getAllTodos API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAllTodos 함수가 실행될 경우 오늘 날짜에 해당되는 금주에 활성화된 투두 목록을 반환한다.", async () => {
    (mockCollection.aggregate as jest.Mock).mockReturnValue({
      toArray: jest.fn().mockResolvedValue(mockTodos),
    });

    const currentDay = new Date().getDay();
    const currentWeekArray = Array.from(
      { length: 7 },
      (_, i) => i - currentDay,
    );
    const currentWeek = currentWeekArray.map(ele => {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      return new Date(Date.now() + ONE_DAY * ele);
    });

    const currentWeekStartDate = new Date(
      currentWeek[0].getFullYear(),
      currentWeek[0].getMonth(),
      currentWeek[0].getDate(),
      0,
      0,
    );

    const currentWeekEndDate = new Date(
      currentWeek[currentWeek.length - 1].getFullYear(),
      currentWeek[currentWeek.length - 1].getMonth(),
      currentWeek[currentWeek.length - 1].getDate(),
      23,
      59,
    );

    const todos = await getAllTodos("mockuser");

    expect(mockCollection.aggregate).toHaveBeenCalledTimes(1);
    expect(mockCollection.aggregate).toHaveBeenCalledWith([
      {
        $match: {
          author: "mockuser",
        },
      },
      {
        $lookup: {
          from: "todo",
          localField: "content",
          foreignField: "_id",
          as: "content",
        },
      },
      {
        $unwind: {
          path: "$content",
        },
      },
      {
        $match: {
          $and: [
            { "content.createdAt": { $lte: currentWeekEndDate } },
            {
              $or: [
                { "content.completedAt": { $gte: currentWeekStartDate } },
                { "content.completedAt": null },
              ],
            },
          ],
        },
      },
      {
        $set: {
          _id: { $toString: "$_id" },
        },
      },
    ]);

    expect(todos).toEqual(mockTodos);
  });
});

describe("getAllTodos 에러 핸들링 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("인수로 받은 userid가 없을 경우 에러 메세지를 반환한다.", async () => {
    ((await headers()).get as jest.Mock).mockResolvedValue(null);
    await getAllTodos(null);

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");

    expect(mockCollection.aggregate).not.toHaveBeenCalled();
  });
});
