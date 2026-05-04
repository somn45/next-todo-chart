import {
  TL_GRAPH_MARGIN,
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  TL_LEGEND_TEXTS,
  TL_LEGEND_COLORS,
} from "@/constants/graph";
import { within } from "@testing-library/react";
import { BandGraph } from "@/utils/graph/band/originGraph";
import { mockTodos } from "../../../../__mocks__/todos";
import { DateDomainBaseType } from "@/types/graph/schema";

describe("BandGraph Class", () => {
  const dateDomainBase: DateDomainBaseType = "month";
  const graphOptions = {
    width: GRAPH_WIDTH,
    height: GRAPH_HEIGHT,
    margin: TL_GRAPH_MARGIN,
    dateDomainBase,
    texts: TL_LEGEND_TEXTS,
    colors: TL_LEGEND_COLORS,
    isMobile: false,
  };
  const bandGraph = new BandGraph(graphOptions, mockTodos);
  it("BandGraph 메서드를 활용해 그래프를 그린다.", () => {
    const mockGraphContainer = document.createElement("div");
    bandGraph.drowBandGraph(mockGraphContainer);
    const svg = within(mockGraphContainer).getByTestId("svg container");
    const g = within(svg).getByTestId("graph area");

    const band = within(g).getAllByTestId("band");
    expect(band).toHaveLength(mockTodos.length);
    band.forEach(band => {
      expect(band).toBeTruthy();

      const bandColor = band.getAttribute("fill");
      expect(TL_LEGEND_COLORS).toContain(bandColor);
    });

    // rect의 크기가 지속적으로 변하는 이슈 해결 후 스냅샷 추가
    // expect(svg).toMatchSnapshot();
  });
});
