import * as d3 from "d3";
import { Graph } from "../graphCore/graphCore";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";
import { caculateTickCount } from "../caculateTickCount";
import { TodoStat } from "@/types/stats/schema";
import {
  D3ScaleType,
  DatDataPoint,
  LegendMarkerLayout,
  LegendMarkerType,
  LegendUnitInitCoord,
} from "@/types/graph/schema";

interface createTimeScaleParams<T extends { date: Date }> {
  rangeMax: number;
  data: T[];
}

export class LineGraph extends Graph {
  protected setXAxis(
    scale: d3.ScaleTime<number, number, never>,
    tickCount: number,
    innerHeight: number,
  ): void {
    this.graphGroup
      .append("g")
      .attr("class", "xAxis")
      .attr("data-testid", "x axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(scale)
          .ticks(tickCount)
          .tickFormat(d =>
            this.dateDomainBase === "year"
              ? (new Date(d.toString()).getMonth() + 1).toString()
              : formatByISO8601(d),
          ),
      );
  }

  protected setYAxis(scale: D3ScaleType): void {
    if ("linearScale" in scale) {
      this.graphGroup
        .append("g")
        .attr("data-testid", "y axis")
        .call(d3.axisLeft(scale.linearScale));
    } else {
      this.graphGroup
        .append("g")
        .attr("data-testid", "y axis")
        .call(d3.axisLeft(scale.bandScale));
    }
  }

  private createTimeScale<T extends { date: Date }>({
    rangeMax,
    data,
  }: createTimeScaleParams<T>): d3.ScaleTime<number, number, never> {
    return d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, rangeMax]);
  }

  private createLinearScale<T extends { count: number }>(
    data: T[],
    rangeMax: number,
  ): d3.ScaleLinear<number, number, never> {
    return d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.count)] as [number, number])
      .range([rangeMax, 0])
      .nice(1);
  }

  private setLineDataset(
    groupedData: d3.InternMap<string, TodoStat[]>,
    color: d3.ScaleOrdinal<string, string, never>,
    lineGenerator: d3.Line<DatDataPoint>,
  ): void {
    this.graphGroup
      .selectAll(".line")
      .data(groupedData.entries())
      .enter()
      .append("path")
      .attr("data-testid", "line")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 2.5)
      .attr("d", d => lineGenerator(d[1]));
  }

  private addTitle(x: number, title: string): void {
    this.svg
      .append("text")
      .attr("aria-label", "graph title")
      .attr("x", x / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text(title);
  }

  private createLegend(
    legendStartOffset: number,
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    return this.svg
      .append("g")
      .attr("data-testid", "legend list")
      .attr("class", "legend")
      .attr("transform", `translate(${legendStartOffset}, 0)`);
  }

  private setLegendRectMarker(
    markerType: LegendMarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    markerLayout: Omit<LegendMarkerLayout, "margin" | "radius">,
    coord: Pick<LegendUnitInitCoord, "x" | "y">,
    color: string,
  ): void {
    const { width, height } = markerLayout;
    const { x, y } = coord;

    legend
      .append(markerType)
      .attr("class", "legendCategory")
      .attr("data-testid", "legend category")
      .attr("width", width)
      .attr("height", height)
      .attr("x", x)
      .attr("y", y)
      .attr("fill", color);
  }

  private setLegendText(
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    coord: Pick<LegendUnitInitCoord, "x" | "y">,
    text: string,
  ): void {
    const { x, y } = coord;
    legend
      .append("text")
      .attr("class", "legendText")
      .attr("data-testid", "legend text")
      .attr("font-size", "12px")
      .attr("x", x)
      .attr("y", y)
      .text(text);
  }

  private setLegendItems(
    markerType: LegendMarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    markerLayout: Partial<Omit<LegendMarkerLayout, "margin">>,
    initCoord: LegendUnitInitCoord,
  ): void {
    const markerWidth = markerLayout.width ?? 0;
    const markerHeight = markerLayout.height ?? 0;

    const legendContents = this.colors.map((color, i) => [
      color,
      this.texts[i],
    ]);
    legendContents.forEach((content, i) => {
      const [color, text] = content;
      const { x, y, textX, textY } = initCoord;

      const coord = {
        x,
        y: y + 25 * (i + 1),
      };
      const textCoord = {
        x: textX,
        y: textY + 25 * (i + 1),
      };

      this.setLegendRectMarker(
        markerType,
        legend,
        { width: markerWidth, height: markerHeight },
        coord,
        color,
      );

      this.setLegendText(legend, textCoord, text);
    });
  }

  drowLineGraph(
    graphContainer: HTMLDivElement,
    data: TodoStat[],
  ):
    | {
        x: d3.ScaleTime<number, number, never>;
        y: d3.ScaleLinear<number, number, never>;
      }
    | undefined {
    this.createSvgContainer(graphContainer);
    const { innerWidth, innerHeight, titleStartOffset, legendStartOffset } =
      this.caculateGraphLayout();

    const groupedStats = d3.group(data, d => d.state);

    this.addTitle(titleStartOffset, "최근 1주간 등록된 투두 합계");

    const legend = this.createLegend(legendStartOffset);
    if (!legend) return;

    const legendMarkerSize = { width: 15, height: 2 };
    const legendInitCoord = { x: 0, y: 0, textX: 22, textY: 6 };
    this.setLegendItems("rect", legend, legendMarkerSize, legendInitCoord);

    const statsKeys = groupedStats.keys();
    const count = statsKeys.toArray().length;
    const tickCount = caculateTickCount(
      this.dateDomainBase,
      count,
      data.length,
    );

    const x_scale = this.createTimeScale({
      rangeMax: innerWidth,
      data,
    });
    this.setXAxis(x_scale, tickCount, innerHeight);

    const y_scale = this.createLinearScale(data, innerHeight);
    this.setYAxis({ type: "linearScale", linearScale: y_scale });

    const lineGenerator = d3
      .line<DatDataPoint>()
      .x(d => x_scale(d.date))
      .y(d => y_scale(d.count));

    const color = this.createColorScale();

    this.setLineDataset(groupedStats, color, lineGenerator);
    return { x: x_scale, y: y_scale };
  }
}
