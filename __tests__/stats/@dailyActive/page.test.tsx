import DailyActive from "@/app/(private)/stats/@dailyActive/page";
import { render } from "@testing-library/react";

jest.mock("@/apis/getTodoStats", () => ({
  getTodoStats: jest.fn().mockResolvedValue([]),
}));
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("accessToken"),
  }),
}));
jest.mock("@/utils/decodeJwtTokenPayload", () => ({
  decodeJwtTokenPayload: jest.fn().mockReturnValue("mockuser"),
}));
jest.mock("@/components/domain/Stat/DailyActiveTodoLineGraph", () =>
  jest.fn(props => <div data-testid="line graph"></div>),
);

import DailyActiveTodoLineGraph from "@/components/domain/Stat/DailyActiveTodoLineGraph";
import { getTodoStats } from "@/apis/getTodoStats";

describe("<DailyActive />", () => {
  it("getTosoStats API에서 가져온 투두 통계 데이터와 함께 LineGraph 컴포넌트를 렌더링한다.", async () => {
    (getTodoStats as jest.Mock).mockResolvedValue([]);
    const dailyActiveComponent = await DailyActive({
      searchParams: Promise.resolve({ da: "month", tl: "week" }),
    });
    render(dailyActiveComponent);

    expect(DailyActiveTodoLineGraph).toHaveBeenCalledWith(
      {
        stats: [],
        dateDomainBase: "month",
      },
      undefined,
    );
  });
});
