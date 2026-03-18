jest.mock("@/libs/database");

import { SerializedTodo } from "@/types/todos/schema";
import * as database from "@/libs/database";
import { IMockDatabase } from "@/libs/__mocks__/database";
import { setTodoStats } from "@/apis/setTodoStats";
import {
  lookupTodoDocument,
  toStringMongoDBObjectId,
  unwindContent,
} from "@/apis/queries/queries";

const { mockCollection } = database as unknown as IMockDatabase;

const MOCK_DATE = new Date(2026, 0, 12);

const mockTodos: SerializedTodo[] = [
  {
    content: {
      _id: "1",
      userid: "mockuser",
      textField: "fake 할 일 1",
      state: "할 일",
      createdAt: new Date(2026, 0, 11).toISOString(),
      updatedAt: new Date(2026, 0, 11).toISOString(),
      completedAt: null,
    },
  },
  {
    content: {
      _id: "2",
      userid: "mockuser",
      textField: "fake 할 일 2",
      state: "완료",
      createdAt: new Date(2026, 0, 8).toISOString(),
      updatedAt: new Date(2026, 0, 9).toISOString(),
      completedAt: new Date(2026, 0, 10).toISOString(),
    },
  },
  {
    content: {
      _id: "3",
      userid: "mockuser",
      textField: "fake 할 일 4",
      state: "완료",
      createdAt: new Date(2026, 0, 10).toISOString(),
      updatedAt: new Date(2026, 0, 11).toISOString(),
      completedAt: new Date(2026, 0, 11, 6).toISOString(),
    },
  },
];

describe("setTodoStats API 함수 성공 테스트", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_DATE);
  });
  it("현재 활성화 중인 할 일 목록이 DB에 등록된다", async () => {
    const prevDateSharp = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1,
      0,
      0,
    );

    const prevDateMidNight = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1,
      23,
      59,
    );

    // aaa
    (mockCollection.findOne as jest.Mock).mockResolvedValue(null);

    // 할 일 목록 중 활성화된 할 일만 반환
    (mockCollection.aggregate as jest.Mock).mockImplementation(() => {
      return {
        toArray: jest.fn().mockResolvedValue(
          mockTodos.filter(todo => {
            const isNotFinish =
              todo.content.state === "할 일" ||
              todo.content.state === "진행 중";
            const isActive =
              todo.content.state === "완료" &&
              new Date(todo.content.createdAt).getTime() <=
                prevDateMidNight.getTime() &&
              new Date(todo.content.completedAt!).getTime() >
                prevDateSharp.getTime();
            return isNotFinish || isActive;
          }),
        ),
      };
    });

    await setTodoStats();

    expect(mockCollection.findOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.findOne).toHaveBeenCalledWith({
      date: prevDateSharp,
    });

    expect(mockCollection.aggregate).toHaveBeenCalledTimes(1);
    expect(mockCollection.aggregate).toHaveBeenCalledWith([
      lookupTodoDocument(),
      unwindContent(),
      {
        $match: {
          $or: [
            {
              $or: [
                { "content.state": "할 일" },
                { "content.state": "진행 중" },
              ],
            },
            {
              $and: [
                { "content.state": "완료" },
                { "content.createdAt": { $lte: prevDateMidNight } },
                { "content.completedAt": { $gt: prevDateSharp } },
              ],
            },
          ],
        },
      },
      toStringMongoDBObjectId(),
    ]);

    expect(mockCollection.insertMany).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertMany).toHaveBeenCalledWith([
      {
        date: new Date(2026, 0, 11),
        state: "총합",
        count: 2,
      },
      {
        date: new Date(2026, 0, 11),
        state: "할 일",
        count: 1,
      },
      {
        date: new Date(2026, 0, 11),
        state: "진행 중",
        count: 0,
      },
      {
        date: new Date(2026, 0, 11),
        state: "완료",
        count: 1,
      },
    ]);
  });
});

describe("setTodoStats API 함수 엣지 케이스 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("이미 등록된 통계 데이터가 있을 경우 해당 통계 데이터를 반환한다.", async () => {
    (mockCollection.findOne as jest.Mock).mockResolvedValue(mockTodos);

    await setTodoStats();

    const prevDateSharp = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1,
      0,
      0,
    );

    expect(mockCollection.findOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.findOne).toHaveBeenCalledWith({
      date: prevDateSharp,
    });

    expect(mockCollection.aggregate).not.toHaveBeenCalled();
    expect(mockCollection.insertMany).not.toHaveBeenCalled();
  });
});
