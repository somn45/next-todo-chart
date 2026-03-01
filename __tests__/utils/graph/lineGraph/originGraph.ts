import {
  DAT_GRAPH_MARGIN,
  DAT_LEGEND_COLORS,
  DAT_LEGEND_TEXTS,
  GRAPH_HEIGHT,
  DAT_LEGEND_INIT_COORD,
  GRAPH_LEGEND_MARKER_SIZE,
  GRAPH_LEGEND_PADDING_RIGHT,
  GRAPH_WIDTH,
} from "@/constants/graph";
import { within } from "@testing-library/react";
import { LineGraph } from "@/utils/graph/line/originGraph";
import { mockTodoStats } from "../../../../__mocks__/stats";

describe("LineGraph Class", () => {
  const lineGraph = new LineGraph(
    GRAPH_WIDTH,
    GRAPH_HEIGHT,
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
    expect(svg).toHaveAttribute("width", GRAPH_WIDTH.toString());
    expect(svg).toHaveAttribute("height", GRAPH_HEIGHT.toString());

    const g = within(svg).getByTestId("graph area");
    expect(g).toBeTruthy();
    expect(g).toHaveAttribute(
      "transform",
      `translate(${DAT_GRAPH_MARGIN.left}, ${DAT_GRAPH_MARGIN.top})`,
    );

    const graphTitle = within(svg).getByLabelText("graph title");
    const titleStartOffset =
      GRAPH_WIDTH - DAT_GRAPH_MARGIN.left + DAT_GRAPH_MARGIN.right;
    expect(graphTitle).toBeTruthy();
    expect(graphTitle).toHaveAttribute("x", (titleStartOffset / 2).toString());
    expect(graphTitle).toHaveAttribute("y", String(30));

    const legendList = within(svg).getByTestId("legend list");
    const legendStartOffset = GRAPH_WIDTH - GRAPH_LEGEND_PADDING_RIGHT;
    expect(legendList).toBeTruthy();
    expect(legendList).toHaveAttribute(
      "transform",
      `translate(${legendStartOffset}, 0)`,
    );

    const legendContents = DAT_LEGEND_COLORS.map((color, i) => [
      color,
      DAT_LEGEND_TEXTS[i],
    ]);

    const legendMarkers = within(legendList).getAllByTestId("legend category");
    legendMarkers.forEach((marker, i) => {
      const { x, y } = DAT_LEGEND_INIT_COORD;

      const coord = {
        x,
        y: y + 25 * (i + 1),
      };

      expect(marker).toBeTruthy();
      expect(marker).toHaveAttribute(
        "width",
        `${GRAPH_LEGEND_MARKER_SIZE.width}`,
      );
      expect(marker).toHaveAttribute(
        "height",
        `${GRAPH_LEGEND_MARKER_SIZE.height}`,
      );
      expect(marker).toHaveAttribute("x", `${coord.x}`);
      expect(marker).toHaveAttribute("y", `${coord.y}`);
      expect(marker).toHaveAttribute("fill", DAT_LEGEND_COLORS[i]);
    });

    const legendTexts = within(legendList).getAllByTestId("legend text");
    legendTexts.forEach((text, i) => {
      const { textX, textY } = DAT_LEGEND_INIT_COORD;

      const textCoord = {
        x: textX,
        y: textY + 25 * (i + 1),
      };

      expect(text).toBeTruthy();
      expect(text).toHaveAttribute("x", `${textCoord.x}`);
      expect(text).toHaveAttribute("y", `${textCoord.y}`);
    });

    const innerHeight =
      GRAPH_HEIGHT - DAT_GRAPH_MARGIN.top - DAT_GRAPH_MARGIN.bottom;

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
