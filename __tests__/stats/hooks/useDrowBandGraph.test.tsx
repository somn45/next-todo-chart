import * as d3 from "d3";
import { cleanup, render, screen, within } from "@testing-library/react";
import { act, useEffect } from "react";
import useDrowBandGraph from "@/app/(private)/stats/_hooks/useDrowBandGraph";
import { LookupedTodo, WithStringifyId } from "@/types/schema";

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 600;
const height = 400;
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

const TestBandGraph = () => {
  const [svg, graphScale, graphWrapperRef] = useDrowBandGraph({
    width,
    height,
    margin,
    data: mockTodos,
  });

  return <div ref={graphWrapperRef} role="graph Wrapper"></div>;
};

describe("useDrowBandGraph 커스텀 훅", () => {
  it("useDrowBandGraph 커스텀 훅에서 모든 그래프 요소를 이용하여 최종적인 타임라인 그래프를 그리는 역할을 수행한다.", async () => {
    render(<TestBandGraph />);

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

      const bands = screen.getAllByTestId("band");

      bands.forEach(band => {
        expect(band).toBeInTheDocument();
      });
    });
  });
});
