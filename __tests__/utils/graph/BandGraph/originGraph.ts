import {
  TL_GRAPH_MARGIN,
  GRAPH_HEIGHT,
  TL_LEGEND_INIT_COORD,
  GRAPH_LEGEND_MARKER_SIZE,
  GRAPH_LEGEND_PADDING_RIGHT,
  GRAPH_WIDTH,
  TL_LEGEND_TEXTS,
  TL_LEGEND_COLORS,
} from "@/constants/graph";
import { screen, within } from "@testing-library/react";
import { BandGraph } from "@/utils/graph/band/originGraph";
import { mockTodos } from "../../../../__mocks__/todos";

describe("BandGraph Class", () => {
  const bandGraph = new BandGraph(
    GRAPH_WIDTH,
    GRAPH_HEIGHT,
    TL_GRAPH_MARGIN,
    "month",
    TL_LEGEND_TEXTS,
    TL_LEGEND_COLORS,
  );
  it("BandGraph 메서드를 활용해 그래프를 그린다.", () => {
    const mockGraphContainer = document.createElement("div");
    bandGraph.drowBandGraph(mockGraphContainer, mockTodos);

    const svg = within(mockGraphContainer).getByTestId("svg container");
    screen.debug(svg);
    expect(svg).toBeTruthy();
    expect(svg).toHaveAttribute("width", GRAPH_WIDTH.toString());
    expect(svg).toHaveAttribute("height", GRAPH_HEIGHT.toString());

    const g = within(svg).getByTestId("graph area");
    expect(g).toBeTruthy();
    expect(g).toHaveAttribute(
      "transform",
      `translate(${TL_GRAPH_MARGIN.left}, ${TL_GRAPH_MARGIN.top})`,
    );

    const graphTitle = within(svg).getByLabelText("graph title");
    const titleStartOffset =
      GRAPH_WIDTH - TL_GRAPH_MARGIN.left + TL_GRAPH_MARGIN.right;
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

    const legendMarkers = within(legendList).getAllByTestId("legend category");
    legendMarkers.forEach((marker, i) => {
      const { x, y } = TL_LEGEND_INIT_COORD;

      const coord = {
        x,
        y: y + 25 * (i + 1),
      };

      expect(marker).toBeTruthy();
      expect(marker).toHaveAttribute("r", `${GRAPH_LEGEND_MARKER_SIZE.radius}`);
      expect(marker).toHaveAttribute("cx", `${coord.x}`);
      expect(marker).toHaveAttribute("cy", `${coord.y}`);
      expect(marker).toHaveAttribute("fill", TL_LEGEND_COLORS[i]);
    });

    const legendTexts = within(legendList).getAllByTestId("legend text");
    legendTexts.forEach((text, i) => {
      const { textX, textY } = TL_LEGEND_INIT_COORD;

      const textCoord = {
        x: textX,
        y: textY + 25 * (i + 1),
      };

      expect(text).toBeTruthy();
      expect(text).toHaveAttribute("x", `${textCoord.x}`);
      expect(text).toHaveAttribute("y", `${textCoord.y}`);
    });

    const innerHeight =
      GRAPH_HEIGHT - TL_GRAPH_MARGIN.top - TL_GRAPH_MARGIN.bottom;

    const x_scale = within(g).getByTestId("x axis");
    expect(x_scale).toBeTruthy();
    expect(x_scale).toHaveAttribute(
      "transform",
      `translate(0, ${innerHeight})`,
    );

    const y_scale = within(g).getByTestId("y axis");
    expect(y_scale).toBeTruthy();

    const band = within(g).getAllByTestId("band");
    band.forEach((band, i) => {
      expect(band).toBeTruthy();
      const bandColor = band.getAttribute("fill");
      console.log(bandColor);
      expect(TL_LEGEND_COLORS).toContain(bandColor);
    });
  });
});
