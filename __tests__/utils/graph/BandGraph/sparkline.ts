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
    const g = within(svg).getByTestId("graph area");

    const band = within(g).getAllByTestId("band");

    expect(band).toHaveLength(mockTodos.length);
    band.forEach(band => {
      const bandColor = band.getAttribute("fill");
      expect(TL_LEGEND_COLORS).toContain(bandColor);
    });

    // rect의 크기가 지속적으로 변하는 이슈 해결 후 스냅샷 추가
    // expect(svg).toMatchSnapshot();
  });
});
