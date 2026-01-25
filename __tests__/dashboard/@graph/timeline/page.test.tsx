import DashboardTimeline from "@/app/(private)/dashboard/@graph/timeline/page";
import TimelineContainer from "@/app/(private)/dashboard/@graph/timeline/TimelineContainer";
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
jest.mock("@/apis/setTodoStats", () => ({
  setTodoStats: jest.fn(),
}));
jest.mock("@/app/(private)/dashboard/@graph/timeline/TimelineContainer", () =>
  jest.fn(() => <div></div>),
);

describe("Dashboard @graph timeline page", () => {
  it("주, 월, 년 검색 범위를 가진 TimelineContainer 자식 컴포넌들이 배치되어 있어야 한다.", async () => {
    const DashboardTimelinePage = await DashboardTimeline();
    render(DashboardTimelinePage);

    const TimelineContainerCalledProps = (
      TimelineContainer as jest.Mock
    ).mock.calls.map(call => call[0]);

    expect(TimelineContainerCalledProps[0]).toEqual(
      expect.objectContaining({
        userid: "mockuser",
      }),
    );
    expect(TimelineContainerCalledProps[1]).toEqual(
      expect.objectContaining({
        userid: "mockuser",
        searchRange: "month",
      }),
    );
    expect(TimelineContainerCalledProps[2]).toEqual(
      expect.objectContaining({
        userid: "mockuser",
        searchRange: "year",
      }),
    );
  });
});
