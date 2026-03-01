import * as d3 from "d3";
import {
  displayFollowElement,
  hiddenFollowElement,
  setCoordFocusAndToolTip,
} from "@/app/(private)/stats/_utils/lineGraphMouseEvent";
import { createFollowMouseFocus } from "../eventElement";
import { caculateGraphLayout } from "../caculateGraphLayout";
import { TodoStat } from "@/types/graph/schema";

interface GraphMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export class LineGraphMouseEvent {
  constructor(
    public graphLayout: {
      width: number;
      height: number;
      margin: GraphMargin;
    },
    public svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    public scale: {
      x: d3.ScaleTime<number, number, never>;
      y: d3.ScaleLinear<number, number, never>;
    },
    public data: TodoStat[],
    public tooltipElement: HTMLDivElement,
  ) {}
  handleGraphMouseEvent() {
    if (this.svg === null || this.scale.x === null || this.scale.y === null)
      return;

    const groupedStats = d3.group(this.data, d => d.state);

    const { width, height, margin } = this.graphLayout;
    const { innerWidth, innerHeight } = caculateGraphLayout(
      width,
      height,
      margin,
    );

    const focus = createFollowMouseFocus(this.svg, "circle", 4);
    const tooltip = d3.select(this.tooltipElement) as d3.Selection<
      HTMLDivElement,
      unknown,
      null,
      undefined
    >;

    this.svg
      .append("rect")
      .attr("fill", "none")
      .style("pointer-events", "all")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .on("mouseover", () => displayFollowElement([focus, tooltip]))
      .on("mousemove", (event: MouseEvent) =>
        setCoordFocusAndToolTip(
          groupedStats,
          { x_scale: this.scale.x, y_scale: this.scale.y },
          { focus, tooltip },
          event,
        ),
      )
      .on("mouseleave", () => hiddenFollowElement([focus, tooltip]));
  }
}
