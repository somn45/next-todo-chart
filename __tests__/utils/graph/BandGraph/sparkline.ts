import {
  SPARKLINE_WIDTH,
  SPARKLINE_HEIGHT,
  TL_GRAPH_MARGIN,
  TL_LEGEND_INIT_COORD,
  GRAPH_LEGEND_MARKER_SIZE,
  GRAPH_LEGEND_PADDING_RIGHT,
  TL_LEGEND_TEXTS,
  TL_LEGEND_COLORS,
} from "@/constants/graph";
import { screen, within } from "@testing-library/react";
import { mockTodos } from "../../../../__mocks__/todos";
import { BandSparkline } from "@/utils/graph/band/sparkline";

describe("BandSparkline Class", () => {
  const bandGraph = new BandSparkline(
    SPARKLINE_WIDTH,
    SPARKLINE_HEIGHT,
    TL_GRAPH_MARGIN,
    "month",
    TL_LEGEND_TEXTS,
    TL_LEGEND_COLORS,
  );
  it("BandGraph 메서드를 활용해 그래프를 그린다.", () => {
    const mockGraphContainer = document.createElement("div");
    bandGraph.drowBandSparkline(mockGraphContainer, mockTodos);

    const svg = within(mockGraphContainer).getByTestId("svg container");
    screen.debug(svg);
    expect(svg).toBeTruthy();
    expect(svg).toHaveAttribute("width", SPARKLINE_WIDTH.toString());
    expect(svg).toHaveAttribute("height", SPARKLINE_HEIGHT.toString());

    const g = within(svg).getByTestId("graph area");
    expect(g).toBeTruthy();
    expect(g).toHaveAttribute(
      "transform",
      `translate(${TL_GRAPH_MARGIN.left}, ${TL_GRAPH_MARGIN.top})`,
    );

    const innerHeight =
      SPARKLINE_HEIGHT - TL_GRAPH_MARGIN.top - TL_GRAPH_MARGIN.bottom;

    const x_scale = within(g).getByTestId("x axis");
    expect(x_scale).toBeTruthy();
    expect(x_scale).toHaveAttribute(
      "transform",
      `translate(0, ${innerHeight})`,
    );

    const y_scale = within(g).getByTestId("y axis");
    expect(y_scale).toBeTruthy();

    const band = within(g).getAllByTestId("band");
    band.forEach(band => {
      expect(band).toBeTruthy();

      const bandColor = band.getAttribute("fill");
      expect(TL_LEGEND_COLORS).toContain(bandColor);
    });
  });
});
