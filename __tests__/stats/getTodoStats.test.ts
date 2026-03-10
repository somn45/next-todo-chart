jest.useFakeTimers();
jest.setSystemTime(new Date(2025, 6, 8));
jest.mock("@/libs/database");
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

import { getTodoStats } from "@/apis/getTodoStats";
import { getDatesLastlyPeriod } from "@/utils/date/createDatesLastlyWeek";
import { redirect } from "next/navigation";
import { mockTodoStats } from "../../__mocks__/stats";
import * as database from "@/libs/database";
import { IMockDatabase } from "@/libs/__mocks__/database";

const { mockCollection } = database as unknown as IMockDatabase;

describe("getTodoStats API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("getTodoStats 함수가 실행될 경우 최근 7일에 해당하는 Todo Stat 목록을 반환한다.", async () => {
    (mockCollection.aggregate as jest.Mock).mockReturnValue({
      toArray: jest.fn().mockResolvedValue(mockTodoStats),
    });

    const todoStats = await getTodoStats("mockuser", "month");
    const searchRange = "month";

    expect(mockCollection.aggregate).toHaveBeenCalledTimes(1);
    expect(mockCollection.aggregate).toHaveBeenCalledWith([
      {
        $match: { date: { $in: getDatesLastlyPeriod(searchRange) } },
      },
      { $project: { _id: 0 } },
    ]);

    expect(todoStats).toEqual(mockTodoStats);
  });
});

describe("getTodoStats 에러 핸들링 테스트", () => {
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
