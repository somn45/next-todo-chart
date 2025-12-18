import {
  createLegend,
  createSVGContainer,
  setLegendItems,
} from "@/utils/graph";

describe("D3 legend function", () => {
  const margin = { top: 20, left: 40, bottom: 20, right: 80 };
  const width = 600 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
  const layout = { width, height, margin };

  const legendLayout = { width: 20, height: 2 };

  it("createLegend 함수 사용 시 svg 컨테이너에 그래프의 legend를 그릴 g 요소가 배치된다", () => {
    const graphWrapper = document.createElement("div");
    const svg = createSVGContainer(layout, graphWrapper);

    createLegend(svg, width);

    const legend: HTMLElement | null = graphWrapper.querySelector(".legend");

    expect(legend).not.toBeNull();
    if (legend) {
      expect(graphWrapper).toContainElement(legend);
    }
  });
  it("setLegendItems 함수는 color 16진수 문자열 배열과 범례를 설명해주는 텍스트 배열을 받아 legend 요소를 설정한다", () => {
    const graphWrapper = document.createElement("div");
    const svg = createSVGContainer(layout, graphWrapper);

    const legend = createLegend(svg, width);

    const legendInitCoord = { x: 0, y: 0, textX: 20, textY: 9 };
    const colors = ["red", "blue", "green"];
    const texts = ["할 일", "진행 중", "완료"];

    setLegendItems(
      "rect",
      legend,
      legendLayout,
      legendInitCoord,
      colors,
      texts,
    );

    const legendCategories: NodeListOf<HTMLElement> =
      graphWrapper.querySelectorAll(".legendCategory");
    const legendListText: NodeListOf<HTMLElement> =
      graphWrapper.querySelectorAll(".legendText");

    expect(legendCategories).toHaveLength(3);
    legendCategories.forEach((legendCategory, i) => {
      expect(legendCategory).toHaveAttribute(
        "width",
        String(legendLayout.width),
      );
      expect(legendCategory).toHaveAttribute(
        "height",
        String(legendLayout.height),
      );
      expect(legendCategory).toHaveAttribute("x", String(0));
      expect(legendCategory).toHaveAttribute("y", String(0 + 25 * i));
      expect(legendCategory).toHaveAttribute("fill", colors[i]);
    });

    legendListText.forEach((legendText, i) => {
      expect(legendText).toHaveAttribute("font-size", "12px");
      expect(legendText).toHaveAttribute("x", String(20));
      expect(legendText).toHaveAttribute("y", String(9 + 25 * i));
      expect(legendText).toHaveTextContent(texts[i]);
    });
  });
});
