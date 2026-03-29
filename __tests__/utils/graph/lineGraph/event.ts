import { select } from "d3-selection";
import { scaleTime, scaleLinear } from "d3-scale";
import { max } from "d3-array";

/**
 * 테스트가 필요한 사항
 * - 마우스가 g 영역 안에 있을 때 focus와 tooltip이 보이는지
 * - 마우스가 g 영역 밖에 있을 때 focus와 tooltip이 숨겨지는지
 * -
 */

import { LineGraphMouseEvent } from "@/utils/graph/line/event";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const fakeTodoStat = [
  {
    date: new Date(2025, 6, 11),
    state: "총합",
    count: 10,
  },
  {
    date: new Date(2025, 6, 11),
    state: "할 일",
    count: 2,
  },
  {
    date: new Date(2025, 6, 11),
    state: "진행 중",
    count: 5,
  },
  {
    date: new Date(2025, 6, 11),
    state: "완료",
    count: 1,
  },
  {
    date: new Date(2025, 6, 12),
    state: "총합",
    count: 8,
  },
  {
    date: new Date(2025, 6, 12),
    state: "할 일",
    count: 3,
  },
  {
    date: new Date(2025, 6, 12),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2025, 6, 12),
    state: "완료",
    count: 2,
  },
  {
    date: new Date(2025, 6, 13),
    state: "총합",
    count: 9,
  },
  {
    date: new Date(2025, 6, 13),
    state: "할 일",
    count: 4,
  },
  {
    date: new Date(2025, 6, 13),
    state: "진행 중",
    count: 0,
  },
  {
    date: new Date(2025, 6, 13),
    state: "완료",
    count: 5,
  },
];

const FAKE_GRAPH_LAYOUT = {
  width: 500,
  height: 500,
  margin: { left: 20, top: 20, right: 20, bottom: 20 },
};

describe("DAT Graph Event Class", () => {
  it("DAT 그래프 내의 rect 영역에 마우스가 있다면 focus와 tooltip의 투명도가 1이 된다.", async () => {
    // 테스트 준비
    const user = userEvent.setup();
    const { width, height, margin } = FAKE_GRAPH_LAYOUT;

    const graphLayout = {
      width,
      height,
      margin,
    };
    const svg = document.createElement("svg");

    const fakeGSelection = select(svg)
      .append("g")
      .attr("data-testid", "graph area")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const fakeTooltip = document.createElement("div");
    fakeTooltip.setAttribute("data-testid", "tooltip");
    const fakeXScale = scaleTime()
      .domain([new Date(2025, 6, 11), new Date(2025, 6, 13)])
      .range([0, height]);
    scaleLinear();
    const fakeYScale = scaleLinear()
      .domain([0, max(fakeTodoStat, d => d.count)] as [number, number])
      .range([width, 0]);

    const gElement = fakeGSelection.node() as unknown as HTMLElement;

    const lineGraphMouseEvent = new LineGraphMouseEvent(
      graphLayout,
      fakeGSelection,
      { x: fakeXScale, y: fakeYScale },
      fakeTodoStat,
      fakeTooltip,
    );
    lineGraphMouseEvent.handleGraphMouseEvent();

    const graphEventArea = within(gElement).getByTestId("event area");
    expect(graphEventArea).toBeTruthy();

    graphEventArea.getBoundingClientRect = () => ({
      width: FAKE_GRAPH_LAYOUT.width,
      height: FAKE_GRAPH_LAYOUT.height,
      ...FAKE_GRAPH_LAYOUT.margin,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    await user.pointer([
      {
        target: graphEventArea,
        coords: { x: 150, y: 300 },
      },
    ]);

    await waitFor(() => {
      screen.debug(gElement);
      const focus = within(gElement).getByTestId("focus");
      expect(focus).toHaveStyle({ opacity: 1 });
      expect(fakeTooltip).toHaveStyle({ opacity: 1 });
    });
  });
});
