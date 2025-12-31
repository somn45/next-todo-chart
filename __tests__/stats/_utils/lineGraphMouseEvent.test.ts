import * as d3 from "d3";
import {
  createFollowMouseFocus,
  createLinearScale,
  createSVGContainer,
  createTimeScale,
} from "@/utils/graph";
import {
  displayFollowElement,
  hiddenFollowElement,
  setCoordFocusAndToolTip,
} from "@/app/(private)/stats/_utils/lineGraphMouseEvent";
import { ILineGraphData } from "@/types/schema";

const mockTodos: ILineGraphData[] = [
  {
    date: new Date(2025, 6, 1),
    state: "할 일",
    count: 5,
  },
  {
    date: new Date(2025, 6, 1),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2025, 6, 1),
    state: "완료",
    count: 2,
  },
  {
    date: new Date(2025, 6, 2),
    state: "할 일",
    count: 3,
  },
  {
    date: new Date(2025, 6, 2),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2025, 6, 2),
    state: "완료",
    count: 0,
  },
  {
    date: new Date(2025, 6, 3),
    state: "할 일",
    count: 6,
  },
  {
    date: new Date(2025, 6, 3),
    state: "진행 중",
    count: 1,
  },
  {
    date: new Date(2025, 6, 3),
    state: "완료",
    count: 3,
  },
];

describe("lineGraphMouseEvent", () => {
  const margin = { top: 20, left: 40, bottom: 20, right: 80 };
  const width = 600 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
  const layout = { width, height, margin };

  it("displayFollowElement 유틸 함수를 사용하면 그래프 내에서 마우스를 따라오는 요소들의 투명도가 1로 변경된다.", () => {
    const graphWrapper = document.createElement("div");
    const tooltipWrapper = document.createElement("div");
    const svg = createSVGContainer(layout, graphWrapper);

    const focus = createFollowMouseFocus(svg, "circle", 8);
    const tooltip = d3.select(tooltipWrapper);
    const tooltipElement = tooltip.node();

    if (tooltipElement) {
      tooltipElement.className = "tooltip";

      graphWrapper.append(tooltipElement);

      displayFollowElement([focus, tooltip]);

      expect(graphWrapper.querySelector(".focus")).toHaveStyle("opacity: 1");
      expect(graphWrapper.querySelector(".tooltip")).toHaveStyle("opacity: 1");
    }
  });
  it("hiddenFollowElement 유틸 함수를 사용하면 그래프 내에서 마우스를 따라오는 요소들의 투명도가 0으로 변경된다.", () => {
    const graphWrapper = document.createElement("div");
    const tooltipWrapper = document.createElement("div");
    const svg = createSVGContainer(layout, graphWrapper);

    const focus = createFollowMouseFocus(svg, "circle", 8);
    const tooltip = d3.select(tooltipWrapper);
    const tooltipElement = tooltip.node();

    if (tooltipElement) {
      tooltipElement.className = "tooltip";

      graphWrapper.append(tooltipElement);

      hiddenFollowElement([focus, tooltip]);

      expect(graphWrapper.querySelector(".focus")).toHaveStyle("opacity: 0");
      expect(graphWrapper.querySelector(".tooltip")).toHaveStyle("opacity: 0");
    }
  });
  it(`setCoordFocusAndToolTip 유틸 함수를 사용하면 그래프 내에서 마우스를 따라오는 요소들의 좌표를 설정한다.`, () => {
    const graphWrapper = document.createElement("div");
    const tooltipWrapper = document.createElement("div");
    const svg = createSVGContainer(layout, graphWrapper);

    const timeScale = createTimeScale({
      rangeMax: width,
      timeScaleDomain: [new Date(2025, 6, 1), new Date(2025, 6, 7)],
    });
    const linearScale = createLinearScale(mockTodos, height);

    const groupedData = d3.group(mockTodos, d => d.state);
    const event = new MouseEvent("mousemove", {
      clientX: 150,
      clientY: 150,
    });

    const focus = createFollowMouseFocus(svg, "circle", 8);
    const tooltip = d3.select(tooltipWrapper);

    const focusElement = focus.node();
    const tooltipElement = tooltip.node();

    if (focusElement && tooltipElement) {
      tooltipElement.className = "tooltip";

      setCoordFocusAndToolTip(
        groupedData,
        { x_scale: timeScale, y_scale: linearScale },
        { focus, tooltip },
        event,
      );

      expect(focusElement).toHaveAttribute("cx");
      expect(focusElement).toHaveAttribute("cy");
      expect(tooltipElement.style.top).toBeDefined();
      expect(tooltipElement.style.left).toBeDefined();
    }
  });
});
