import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import LineGraphContainer from "@/app/(private)/dashboard/@graph/line-graph/LineGraphContainer";
import { mockStats } from "../../../../__mocks__/stats";
import { render } from "@testing-library/react";
import { distributeByDate } from "@/app/(private)/stats/_utils/distributeByDate";
import LineGraphSparkline from "@/app/(private)/dashboard/@graph/line-graph/Sparkline";

jest.mock("@/apis/getIntegratedTodos", () => ({
  getIntegratedTodos: jest.fn().mockResolvedValue([]),
}));
jest.mock("@/app/(private)/dashboard/@graph/line-graph/Sparkline", () =>
  jest.fn(() => <div></div>),
);

describe("@graph line-graph LineGraphContainer", () => {
  it("getIntegratedTodos API에서 받은 todo stats를 가공해 스파크라인 그래프를 그리는 컴포넌트에 전달한다.", async () => {
    (getIntegratedTodos as jest.Mock).mockResolvedValue({
      todoStats: mockStats,
    });
    const LineGraphContainerComponent = await LineGraphContainer({
      userid: "mockuser",
      searchRange: "month",
    });
    const lineGraphDatas = distributeByDate(mockStats);

    render(LineGraphContainerComponent);
    expect(LineGraphSparkline).toHaveBeenCalledWith(
      {
        stats: lineGraphDatas,
        dateDomainBase: "month",
      },
      undefined,
    );
  });
});
