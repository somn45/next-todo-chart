import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import TimelineContainer from "@/app/(private)/dashboard/@graph/timeline/TimelineContainer";
import { render } from "@testing-library/react";
import { mockTodos } from "../../../../__mocks__/todos";

jest.mock("@/apis/getIntegratedTodos", () => ({
  getIntegratedTodos: jest.fn().mockResolvedValue([]),
}));
jest.mock("@/app/(private)/dashboard/@graph/timeline/Sparkline", () =>
  jest.fn(() => <div></div>),
);

import TimeLineSparkline from "@/app/(private)/dashboard/@graph/timeline/Sparkline";

describe("Dashboard @graph Timeline TimelineContainer", () => {
  it("getIntegratedTodos API에서 받은 activeTodos를 가공해 스파크라인 그래프를 그리는 컴포넌트에 전달한다.", async () => {
    (getIntegratedTodos as jest.Mock).mockResolvedValue({
      activeTodos: mockTodos,
    });
    const TimelineContainerComponent = await TimelineContainer({
      userid: "mockuser",
      searchRange: "month",
    });
    render(TimelineContainerComponent);

    expect(TimeLineSparkline).toHaveBeenCalledWith(
      {
        todos: mockTodos,
        dateDomainBase: "month",
      },
      undefined,
    );
  });
});
