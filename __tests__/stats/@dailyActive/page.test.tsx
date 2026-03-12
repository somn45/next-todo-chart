import DailyActive from "@/app/(private)/stats/@dailyActive/page";
import { render } from "@testing-library/react";

const mockTodoStats: TodoStat[] = [
  {
    date: new Date(2026, 1, 20),
    state: "총합",
    count: 8,
  },
  {
    date: new Date(2026, 1, 20),
    state: "할 일",
    count: 3,
  },
  {
    date: new Date(2026, 1, 20),
    state: "진행 중",
    count: 4,
  },
  {
    date: new Date(2026, 1, 20),
    state: "완료",
    count: 1,
  },
];

jest.mock("@/libs/database");
jest.mock("@/apis/getTodoStats");
jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("mockuser"),
  }),
}));
jest.mock("@/components/domain/Stat/DailyActiveTodoLineGraph", () =>
  jest.fn(() => <div data-testid="line graph"></div>),
);

import DailyActiveTodoLineGraph from "@/components/domain/Stat/DailyActiveTodoLineGraph";
import { getTodoStats } from "@/apis/getTodoStats";
import { TodoStat } from "@/types/stats/schema";

describe("<DailyActive />", () => {
  it("getTosoStats API에서 가져온 투두 통계 데이터와 함께 LineGraph 컴포넌트를 렌더링한다.", async () => {
    (getTodoStats as jest.Mock).mockResolvedValue(mockTodoStats);
    const dailyActiveComponent = await DailyActive({
      searchParams: Promise.resolve({ da: "month", tl: "week" }),
    });
    render(dailyActiveComponent);

    expect(DailyActiveTodoLineGraph).toHaveBeenCalledWith(
      {
        stats: mockTodoStats,
        dateDomainBase: "month",
      },
      undefined,
    );
  });
});
