import * as d3 from "d3";

import { createSVGContainer } from "@/utils/graph";

describe("createSVGContainer", () => {
  const margin = { top: 20, left: 40, bottom: 20, right: 80 };
  const width = 600 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
  const layout = { width, height, margin };

  it("그래프를 그릴 svg 컨테이너와 그래프 관련 요소를 묶는 g 요소를 반환한다.", () => {
    const graphWrapper: HTMLDivElement | null = document.createElement("div");
    const svg = createSVGContainer(layout, graphWrapper).node();

    expect(svg).not.toBeNull();
    if (svg) {
      expect(svg).toHaveAttribute(
        "width",
        String(width + margin.left + margin.right),
      );
      expect(svg).toHaveAttribute(
        "height",
        String(height + margin.top + margin.bottom),
      );

      const g = svg.children.item(0);
      expect(g).not.toBeNull();
      expect(g).toHaveAttribute(
        "transform",
        `translate(${margin.left}, ${margin.top})`,
      );
    }
  });
  it("svg 컨테이너의 부모 요소를 받지 못한다면 에러를 던진다.", () => {
    const graphWrapper: HTMLDivElement | null = null;
    expect(() => createSVGContainer(layout, graphWrapper)).toThrow(
      "그래프를 그리는 도중 문제가 발생했습니다.",
    );
  });
});
