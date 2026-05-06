import {
  SPARKLINE_WIDTH,
  SPARKLINE_HEIGHT,
  TL_GRAPH_MARGIN,
  TL_LEGEND_TEXTS,
  TL_LEGEND_COLORS,
} from "@/constants/graph";
import { within } from "@testing-library/react";
import { mockTodos } from "../../../../__mocks__/todos";
import { BandSparkline } from "@/utils/graph/band/sparkline";
import { DateDomainBaseType } from "@/types/graph/schema";

describe("BandSparkline Class", () => {
  it("BandGraph 메서드를 활용해 그래프를 그린다.", () => {
    const dateDomainBase: DateDomainBaseType = "month";
    const graphOptions = {
      width: SPARKLINE_WIDTH,
      height: SPARKLINE_HEIGHT,
      margin: TL_GRAPH_MARGIN,
      dateDomainBase,
      texts: TL_LEGEND_TEXTS,
      colors: TL_LEGEND_COLORS,
    };
    const bandGraph = new BandSparkline(graphOptions, mockTodos);

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
