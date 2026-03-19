jest.useFakeTimers();
jest.setSystemTime(new Date(2026, 0, 20));
jest.mock("@/libs/database");
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

import { getTodoStats } from "@/apis/getTodoStats";
import { redirect } from "next/navigation";
import * as database from "@/libs/database";
import { IMockDatabase } from "@/libs/__mocks__/database";

const { mockCollection } = database as unknown as IMockDatabase;

import { TodoStat } from "@/types/stats/schema";

// 전체 통계 데이터
export const mockTodoStats: TodoStat[] = [
  {
    date: new Date(2026, 0, 14),
    state: "할 일",
    count: 7,
  },
  {
    date: new Date(2026, 0, 14),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2026, 0, 14),
    state: "완료",
    count: 5,
  },
  {
    date: new Date(2026, 0, 14),
    state: "총합",
    count: 14,
  },
  {
    date: new Date(2026, 0, 17),
    state: "할 일",
    count: 7,
  },
  {
    date: new Date(2026, 0, 17),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2026, 0, 17),
    state: "완료",
    count: 5,
  },
  {
    date: new Date(2026, 0, 17),
    state: "총합",
    count: 14,
  },
  {
    date: new Date(2026, 0, 23),
    state: "할 일",
    count: 7,
  },
  {
    date: new Date(2026, 0, 23),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2026, 0, 23),
    state: "완료",
    count: 5,
  },
  {
    date: new Date(2026, 0, 23),
    state: "총합",
    count: 14,
  },
];

/*
  mockTodoStats 중 2026-01-20 날짜에서 최근 7일 내 등록된 데이터 모음
*/
const expectedTodoStats: TodoStat[] = [
  {
    date: new Date(2026, 0, 14),
    state: "할 일",
    count: 7,
  },
  {
    date: new Date(2026, 0, 14),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2026, 0, 14),
    state: "완료",
    count: 5,
  },
  {
    date: new Date(2026, 0, 14),
    state: "총합",
    count: 14,
  },
  {
    date: new Date(2026, 0, 17),
    state: "할 일",
    count: 7,
  },
  {
    date: new Date(2026, 0, 17),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2026, 0, 17),
    state: "완료",
    count: 5,
  },
  {
    date: new Date(2026, 0, 17),
    state: "총합",
    count: 14,
  },
];

describe("getTodoStats API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("getTodoStats 함수가 실행될 경우 최근 7일에 해당하는 Todo Stat 목록을 반환한다.", async () => {
    const searchRange = "week";
    const fakeLastlyWeekDates = Array.from(
      { length: 7 },
      (v, i) => new Date(2026, 0, 20 - 7 + i),
    );

    // 최근 1주 내에 포함된 날짜 배열을 가져오는 역할 모의

    (mockCollection.aggregate as jest.Mock).mockImplementation(() => {
      return {
        toArray: () =>
          Promise.resolve(
            mockTodoStats.filter(todoStat =>
              fakeLastlyWeekDates.some(
                target => target.getTime() === todoStat.date.getTime(),
              ),
            ),
          ),
      };
    });

    const todoStats = await getTodoStats("mockuser", searchRange);

    expect(mockCollection.aggregate).toHaveBeenCalledTimes(1);
    expect(mockCollection.aggregate).toHaveBeenCalledWith([
      {
        $match: { date: { $in: fakeLastlyWeekDates } },
      },
      { $project: { _id: 0 } },
    ]);

    expect(todoStats).toEqual(expectedTodoStats);
  });
});

describe("getTodoStats 엣지 케이스 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("인수로 받은 userid가 없을 경우 에러 메세지를 반환한다.", async () => {
    await getTodoStats(null);

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");

    expect(mockCollection.aggregate).not.toHaveBeenCalled();
  });
});
