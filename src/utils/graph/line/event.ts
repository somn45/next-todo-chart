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

  private createDatasetFocus(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    radius: number,
  ) {
    const focus = svg
      .append("g")
      .append("circle")
      .attr("data-testid", "focus")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("r", radius)
      .style("opacity", 0);

    console.log(focus);

    this.focus = focus;
  }

  private getDataPointClosetMousePointer(
    groupedData: d3.InternMap<string, TodoStat[]>,
    event: MouseEvent,
  ) {
    const [mouseXCoord, mouseYCoord] = d3.pointer(event, this);

    const dateMatchedMouseXCoord = this.scale.x.invert(mouseXCoord);

    const stats = Array.from(groupedData)[0][1];
    const xAxisKeys = stats.map(stat => stat.date);

    // 마우스 포인터의 x 축과 가장 가까운 데이터셋 index
    const indexOfMouseYCoord = d3.bisectCenter(
      xAxisKeys,
      dateMatchedMouseXCoord,
    );

    const distancesMouseYCoord = Array.from(groupedData).map(data => {
      const dataPoint = data[1][indexOfMouseYCoord];
      return Math.abs(this.scale.y(dataPoint.count) - mouseYCoord);
    });

    const dataPointClosedYCoord = distancesMouseYCoord.indexOf(
      Math.min(...distancesMouseYCoord),
    );

    const target =
      Array.from(groupedData)[dataPointClosedYCoord][1][indexOfMouseYCoord];
    return { ...target, y_pixel: this.scale.y(target.count) };
  }

  /** focus와 tooltip이 그래프 스케치 영역으로 들어왔다면 표시 */
  private displayFollowElements(
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  ) {
    [this.focus, tooltip].forEach(element => element.style("opacity", 1));
  }

  /** focus와 tooltip의 위치값 설정 */
  private setCoordFocusAndToolTip(
    groupedData: d3.InternMap<string, TodoStat[]>,
    graphScale: TimeBasedLinearScale,
    event: MouseEvent,
  ) {
    const { x_scale, y_scale } = graphScale;

    const target = this.getDataPointClosetMousePointer(groupedData, event);
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
  private hiddenFollowElements(
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
