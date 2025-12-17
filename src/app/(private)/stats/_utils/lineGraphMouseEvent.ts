import * as d3 from "d3";
import { getDataPointClosetMousePointer } from "./getDataPointClosetMousePointer";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FollowElements = d3.Selection<any, unknown, any, unknown>;

interface LineGraphData {
  date: Date;
  state: string;
  count: number;
}

interface TimeBasedLinearScale {
  x_scale: d3.ScaleTime<number, number, never>;
  y_scale: d3.ScaleLinear<number, number, never>;
}

interface Elements {
  focus: d3.Selection<SVGCircleElement, unknown, null, undefined>;
  tooltip: d3.Selection<null, unknown, null, undefined>;
}

export const displayFollowElement = (followElements: FollowElements[]) => {
  followElements.forEach(element => element.style("opacity", 1));
};

export const setCoordFocusAndToolTip = (
  groupedData: d3.InternMap<string, LineGraphData[]>,
  graphScale: TimeBasedLinearScale,
  followElements: Elements,
) => {
  const { x_scale, y_scale } = graphScale;
  const { focus, tooltip } = followElements;

  const target = getDataPointClosetMousePointer(groupedData, {
    x_scale,
    y_scale,
  });
  const dateISO8601Type = formatByISO8601(target.date);

  focus.attr("cx", x_scale(target.date)).attr("cy", target.y_pixel);
  tooltip
    .html(
      `${dateISO8601Type} 일자에서<br/> ${target.state} 상태의 총합 : ${target.count}개`,
    )
    .style("left", `${x_scale(target.date) - 25}px`)
    .style("top", `${target.y_pixel - 15}px`);
};

export const hiddenFollowElement = (followElements: FollowElements[]) => {
  followElements.forEach(element => element.style("opacity", 0));
};
