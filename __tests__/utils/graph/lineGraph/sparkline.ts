import {
  SPARKLINE_WIDTH,
  SPARKLINE_HEIGHT,
  DAT_GRAPH_MARGIN,
  DAT_LEGEND_COLORS,
  DAT_LEGEND_TEXTS,
} from "@/constants/graph";
import { within } from "@testing-library/react";
import { LineGraph } from "@/utils/graph/line/originGraph";
import { mockTodoStats } from "../../../../__mocks__/stats";

describe("LineGraph Class", () => {
  const lineGraph = new LineGraph(
    SPARKLINE_WIDTH,
    SPARKLINE_HEIGHT,
    DAT_GRAPH_MARGIN,
    "month",
    DAT_LEGEND_TEXTS,
    DAT_LEGEND_COLORS,
  );
  it("lineGraph 메서드를 활용해 그래프를 그린다.", () => {
    const mockGraphContainer = document.createElement("div");
    lineGraph.drowLineGraph(mockGraphContainer, mockTodoStats);
    const svg = within(mockGraphContainer).getByTestId("svg container");
    const g = within(svg).getByTestId("graph area");

    const lines = within(g).getAllByTestId("line");
    expect(lines).toHaveLength(DAT_LEGEND_TEXTS.length);
    lines.forEach(line => {
      expect(line).toBeTruthy();
      const lineStroke = line.getAttribute("stroke");
      expect(DAT_LEGEND_COLORS).toContain(lineStroke);
    });

    expect(svg).toMatchSnapshot();
  });
});
