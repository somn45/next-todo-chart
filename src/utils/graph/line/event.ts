import * as d3 from "d3";
import { caculateGraphLayout } from "../caculateGraphLayout";
import { TodoStat } from "@/types/stats/schema";
import { getDataPointClosetMousePointer } from "@/app/(private)/stats/_utils/getDataPointClosetMousePointer";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";

interface GraphMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface TimeBasedLinearScale {
  x_scale: d3.ScaleTime<number, number, never>;
  y_scale: d3.ScaleLinear<number, number, never>;
}

export class LineGraphMouseEvent {
  private _focus?: d3.Selection<SVGCircleElement, unknown, null, undefined>;
  private _tooltipSelection?: d3.Selection<
    HTMLDivElement,
    unknown,
    null,
    undefined
  >;
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
    private tooltipElement: HTMLDivElement,
  ) {
    this._tooltipSelection = d3.select(this.tooltipElement) as d3.Selection<
      HTMLDivElement,
      unknown,
      null,
      undefined
    >;
  }

  set focus(focus: d3.Selection<SVGCircleElement, unknown, null, undefined>) {
    this._focus = focus;
  }
  get focus() {
    if (!this._focus) throw new Error("생성된 Focus가 존재하지 않습니다...");
    return this._focus;
  }

  get tooltipSelection() {
    if (!this._tooltipSelection)
      throw new Error("지정된 그래프 캔버스 태그가 존재하지 않습니다...");
    return this._tooltipSelection;
  }

  createDatasetFocus(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    radius: number,
  ) {
    const focus = svg
      .append("g")
      .append("circle")
      .attr("class", "focus")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("r", radius)
      .style("opacity", 0);

    this.focus = focus;
  }

  /** focus와 tooltip이 그래프 스케치 영역으로 들어왔다면 표시 */
  displayFollowElements(
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  ) {
    [this.focus, tooltip].forEach(element => element.style("opacity", 1));
  }

  /** focus와 tooltip의 위치값 설정 */
  setCoordFocusAndToolTip(
    groupedData: d3.InternMap<string, TodoStat[]>,
    graphScale: TimeBasedLinearScale,
    event: MouseEvent,
  ) {
    const { x_scale, y_scale } = graphScale;

    const target = getDataPointClosetMousePointer(
      groupedData,
      {
        x_scale,
        y_scale,
      },
      event,
    );
    const dateISO8601Type = formatByISO8601(target.date);

    this.focus.attr("cx", x_scale(target.date)).attr("cy", target.y_pixel);
    this.tooltipSelection
      .html(
        `${dateISO8601Type} 일자에서<br/> ${target.state} 상태의 총합 : ${target.count}개`,
      )
      .style("left", `${x_scale(target.date) - 25}px`)
      .style("top", `${target.y_pixel - 15}px`);
  }

  /** focus와 tooltip이 그래프 스케치 영역으로 나갔다면 숨김 */
  hiddenFollowElements(
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  ) {
    [this.focus, tooltip].forEach(element => element.style("opacity", 0));
  }

  handleGraphMouseEvent() {
    const groupedStats = d3.group(this.data, d => d.state);

    const { width, height, margin } = this.graphLayout;
    const { innerWidth, innerHeight } = caculateGraphLayout(
      width,
      height,
      margin,
    );

    this.createDatasetFocus(this.svg, 4);

    this.svg
      .append("rect")
      .attr("fill", "none")
      .style("pointer-events", "all")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .on("mouseover", () => this.displayFollowElements(this.tooltipSelection))
      .on("mousemove", (event: MouseEvent) =>
        this.setCoordFocusAndToolTip(
          groupedStats,
          { x_scale: this.scale.x, y_scale: this.scale.y },
          event,
        ),
      )
      .on("mouseleave", () => this.hiddenFollowElements(this.tooltipSelection));
  }
}
