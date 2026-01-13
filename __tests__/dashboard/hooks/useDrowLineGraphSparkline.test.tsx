import { render, screen, within } from "@testing-library/react";
import { mockStats } from "../../../__mocks__/stats";
import { distributeByDate } from "@/app/(private)/stats/_utils/distributeByDate";
import { act } from "react";
import useDrowLineGraphSparkline from "@/app/(private)/dashboard/hooks/useDrowLineGraphSparkline";
const GRAPH_WIDTH = 600;
const GRAPH_HEIGHT = 400;

const MockLineGraphSparkline = () => {
  const [, , lineGraphSparklineRef] = useDrowLineGraphSparkline({
    outerWidth: GRAPH_WIDTH,
    outerHeight: GRAPH_HEIGHT,
    data: distributeByDate(mockStats),
  });

  return <div ref={lineGraphSparklineRef}></div>;
};

describe("useDrowLineGraphSparkline 커스텀 훅", () => {
  it("svg 요소, 촉 그리고 선만 이용하여 스파크라인 라인 그래프 요소들이 렌더링되어야 한다.", () => {
    render(<MockLineGraphSparkline />);

    act(() => {
      const svgContainer = screen.getByTestId("svg container");
      expect(svgContainer).toBeInTheDocument();

      const withinSvgContainer = within(svgContainer);

      const graphArea = withinSvgContainer.getByTestId("graph area");
      expect(graphArea).toBeInTheDocument();

      const xAxis = withinSvgContainer.getByTestId("x axis");
      expect(xAxis).toBeInTheDocument();
      const yAxis = withinSvgContainer.getByTestId("y axis");
      expect(yAxis).toBeInTheDocument();

      const lines = withinSvgContainer.getAllByTestId("line");
      lines.forEach(line => expect(line).toBeInTheDocument());
      expect(lines).toHaveLength(4);
      const colors = lines.map(line => line.getAttribute("stroke"));
      expect(colors).toEqual(
        expect.arrayContaining(["#000000", "#3498DB", "#FFA500", "#2ECC71"]),
      );
    });
  });
});
