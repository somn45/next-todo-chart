import LineGraphSparkline from "@/app/(private)/dashboard/@graph/line-graph/Sparkline";
import { render, screen } from "@testing-library/react";
import { mockStats } from "../../../../__mocks__/stats";

describe("line-graph Sparkline", () => {
  it("LineGraph 컴포넌트에서 커스텀 훅에서 받은 svg가 렌더링된다.", () => {
    render(<LineGraphSparkline stats={mockStats} dateDomainBase="month" />);

    const svgContainer = screen.getByTestId("svg container");
    expect(svgContainer).toBeInTheDocument();
  });
});
