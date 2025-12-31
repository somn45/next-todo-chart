import useDrowLineGraph from "@/app/(private)/stats/_hooks/useDrowLineGraph";
import { render, screen, within } from "@testing-library/react";
import { act } from "react";
import { ILineGraphData } from "@/types/schema";

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 600;
const height = 400;
const mockTodos: ILineGraphData[] = [
  {
    date: new Date(2025, 6, 1),
    state: "할 일",
    count: 5,
  },
  {
    date: new Date(2025, 6, 1),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2025, 6, 1),
    state: "완료",
    count: 2,
  },
  {
    date: new Date(2025, 6, 2),
    state: "할 일",
    count: 3,
  },
  {
    date: new Date(2025, 6, 2),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2025, 6, 2),
    state: "완료",
    count: 0,
  },
  {
    date: new Date(2025, 6, 3),
    state: "할 일",
    count: 6,
  },
  {
    date: new Date(2025, 6, 3),
    state: "진행 중",
    count: 1,
  },
  {
    date: new Date(2025, 6, 3),
    state: "완료",
    count: 3,
  },
];

const TestLineGraph = () => {
  const [svg, graphScale, graphWrapperRef] = useDrowLineGraph({
    width,
    height,
    margin,
    data: mockTodos,
  });

  return <div ref={graphWrapperRef} role="graph Wrapper"></div>;
};

describe("useDrowLineGraph 커스텀 훅", () => {
  it("useDrowLineGraph 커스텀 훅에서 모든 그래프 요소를 이용하여 최종적인 라인 그래프를 그리는 역할을 수행한다.", async () => {
    render(<TestLineGraph />);

    await act(async () => {
      const svgContainer = screen.getByTestId("svg container");
      expect(svgContainer).toBeInTheDocument();
      const g = within(svgContainer).getByTestId("graph area");
      expect(g).toBeInTheDocument();

      const graphTitle = within(g).getByLabelText("graph title");
      expect(graphTitle).toBeInTheDocument();

      const legendList = within(g).getByTestId("legend list");
      expect(legendList).toBeInTheDocument();

      const legendCategories = within(g).getAllByTestId("legend category");
      legendCategories.forEach(legendCategory => {
        expect(legendCategory).toBeInTheDocument();
      });
      const legendTexts = within(g).getAllByTestId("legend text");
      legendTexts.forEach(legendText => {
        expect(legendText).toBeInTheDocument();
      });

      const xAxis = screen.getByTestId("x axis", {
        exact: true,
      });
      expect(xAxis).toBeInTheDocument();
      const yAxis = screen.getByTestId("y axis");
      expect(yAxis).toBeInTheDocument();

      const lines = screen.getAllByTestId("line");
      lines.forEach(line => {
        expect(line).toBeInTheDocument();
      });
    });
  });
});
