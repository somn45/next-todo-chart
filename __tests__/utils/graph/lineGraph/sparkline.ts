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
    expect(svg).toBeTruthy();
    expect(svg).toHaveAttribute("width", SPARKLINE_WIDTH.toString());
    expect(svg).toHaveAttribute("height", SPARKLINE_HEIGHT.toString());

    const g = within(svg).getByTestId("graph area");
    expect(g).toBeTruthy();
    expect(g).toHaveAttribute(
      "transform",
      `translate(${DAT_GRAPH_MARGIN.left}, ${DAT_GRAPH_MARGIN.top})`,
    );

    const innerHeight =
      SPARKLINE_HEIGHT - DAT_GRAPH_MARGIN.top - DAT_GRAPH_MARGIN.bottom;

    const x_scale = within(g).getByTestId("x axis");
    expect(x_scale).toBeTruthy();
    expect(x_scale).toHaveAttribute(
      "transform",
      `translate(0, ${innerHeight})`,
    );

    const y_scale = within(g).getByTestId("y axis");
    expect(y_scale).toBeTruthy();

    const lines = within(g).getAllByTestId("line");
    lines.forEach(line => {
      expect(line).toBeTruthy();

      const lineStroke = line.getAttribute("stroke");
      expect(DAT_LEGEND_COLORS).toContain(lineStroke);
    });
  });
});
