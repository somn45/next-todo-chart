import { createFollowMouseFocus, createSVGContainer } from "@/utils/graph";

describe("createFollowMouseFocus", () => {
  const margin = { top: 20, left: 40, bottom: 20, right: 80 };
  const width = 600 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
  const layout = { width, height, margin };

  it("svg와 요소의 반지름 길이를 받아 마우스를 따라올 포커스 요소를 svg 자식 요소로 설정되고 반환한다.", () => {
    const graphWrapper = document.createElement("div");
    const svg = createSVGContainer(layout, graphWrapper);

    const focus = createFollowMouseFocus(svg, "circle", 4).node();

    expect(focus).not.toBeNull();
    if (focus) {
      expect(graphWrapper).toContainElement(focus);
      expect(focus).toHaveAttribute("fill", "none");
      expect(focus).toHaveAttribute("stroke", "black");
      expect(focus).toHaveAttribute("r", "4");
      expect(focus).toHaveStyle("opacity: 0");
    }
  });
});
