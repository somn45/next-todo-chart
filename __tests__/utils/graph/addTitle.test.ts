import { addTitle, createSVGContainer } from "@/utils/graph";

const margin = { top: 20, left: 40, bottom: 20, right: 80 };
const width = 600 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;
const layout = { width, height, margin };

describe("addTitle", () => {
  it("addTitle 함수 사용 시 개발자가 지정한 좌표와 스타일의 제목이 text 요소에 할당된다.", () => {
    const graphWrapper: HTMLDivElement = document.createElement("div");
    const svg = createSVGContainer(layout, graphWrapper);
    const graphTitle = "모의 그래프 제목";

    addTitle(svg, width, 20, graphTitle);

    const textElement = graphWrapper.querySelector("text");

    expect(textElement).not.toBeNull();
    if (textElement) {
      expect(textElement).toHaveAttribute("x", String(width / 2));
      expect(textElement).toHaveAttribute("y", String(20));
      expect(textElement).toHaveAttribute("text-anchor", "middle");
      expect(textElement).toHaveAttribute("font-size", "20px");
      expect(textElement).toHaveAttribute("font-weight", "bold");
      expect(textElement).toHaveTextContent("모의 그래프 제목");
    }
  });
});
