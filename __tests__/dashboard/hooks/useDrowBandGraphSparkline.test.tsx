import useDrowTimelineSparkline from "@/app/(private)/dashboard/hooks/useDrowTimelineSparkline";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import { render, screen, within } from "@testing-library/react";
import { act } from "react";

const GRAPH_WIDTH = 600;
const GRAPH_HEIGHT = 400;

const mockTodos: (LookupedTodo & WithStringifyId)[] = [
  {
    _id: "1",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "mockuser",
      textField: "테스트 코드 작성",
      state: "진행 중",
      createdAt: new Date(2025, 6, 1).toString(),
      updatedAt: new Date(2025, 6, 5),
      completedAt: new Date(2025, 6, 5),
    },
  },
  {
    _id: "2",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "testing",
      textField: "디자인 추가",
      state: "할 일",
      createdAt: new Date(2025, 6, 3).toString(),
      updatedAt: new Date(2025, 6, 7),
      completedAt: null,
    },
  },
  {
    _id: "3",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "mockuser",
      textField: "주간 회의 일지 작성",
      state: "완료",
      createdAt: new Date(2025, 5, 30).toString(),
      updatedAt: new Date(2025, 6, 3),
      completedAt: new Date(2025, 6, 3),
    },
  },
];

const MockTimelineSparkline = () => {
  const [, , timelineSparklineRef] = useDrowTimelineSparkline({
    outerWidth: GRAPH_WIDTH,
    outerHeight: GRAPH_HEIGHT,
    data: mockTodos,
  });
  return <div ref={timelineSparklineRef}></div>;
};

describe("useDrowBandGraphSparkline 커스텀 훅", () => {
  it("svg 요소, 촉 그리고 밴드만 이용하여 스파크라인 밴드 그래프 요소들이 렌더링되어야 한다.", () => {
    render(<MockTimelineSparkline />);

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

      const bands = withinSvgContainer.getAllByTestId("band");
      bands.forEach(band => expect(band).toBeInTheDocument());
      expect(bands).toHaveLength(3);
      const colors = bands.map(band => band.getAttribute("fill"));
      expect(colors).toEqual(
        expect.arrayContaining(["#3498DB", "#FFA500", "#2ECC71"]),
      );
    });
  });
});
