import LineGraphContainer from "@/app/(private)/dashboard/@graph/line-graph/LineGraphContainer";
import DashboardDailyActive from "@/app/(private)/dashboard/@graph/line-graph/page";
import { render } from "@testing-library/react";

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn(() => ({
      name: "",
      value: "",
    })),
  }),
}));
jest.mock("@/utils/decodeJwtTokenPayload", () => ({
  decodeJwtTokenPayload: jest.fn().mockReturnValue({
    sub: "mockuser",
  }),
}));
jest.mock(
  "@/app/(private)/dashboard/@graph/line-graph/LineGraphContainer",
  () => jest.fn(() => <div></div>),
);

describe("Dashboard @graph line-graph page", () => {
  it("주, 월, 년 검색 범위를 가진 LineGraphContainer 자식 컴포넌들이 배치되어 있어야 한다.", async () => {
    const dashboardDailyActiveComponent = await DashboardDailyActive();
    render(dashboardDailyActiveComponent);

    const LineGraphContainerCalledProps = (
      LineGraphContainer as jest.Mock
    ).mock.calls.map(call => call[0]);

    expect(LineGraphContainerCalledProps[0]).toEqual({ userid: "mockuser" });
    expect(LineGraphContainerCalledProps[1]).toEqual({
      userid: "mockuser",
      searchRange: "month",
    });
    expect(LineGraphContainerCalledProps[2]).toEqual({
      userid: "mockuser",
      searchRange: "year",
    });
  });
});
