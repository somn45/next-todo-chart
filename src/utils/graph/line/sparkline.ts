import { scaleTime, scaleLinear } from "d3-scale";
import { axisLeft, axisBottom } from "d3-axis";
import { max, extent, group } from "d3-array";
import { line } from "d3-shape";
import { Graph } from "../graphCore/graphCore";
import { caculateTickCount } from "../caculateTickCount";
import { TodoStat } from "@/types/stats/schema";
import { D3ScaleType, DatDataPoint } from "@/types/graph/schema";
import { caculateGraphLayout } from "../caculateGraphLayout";

interface createTimeScaleParams<T extends { date: Date }> {
  rangeMax: number;
  data: T[];
}

export class LineSparkline extends Graph {
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
        axisBottom(scale)
          .ticks(tickCount)
          .tickFormat(d =>
            this.dateDomainBase === "year"
              ? (new Date(d.toString()).getMonth() + 1).toString()
              : new Date(d.toString()).getDate().toString(),
          ),
      );
  }

  protected setYAxis(scale: D3ScaleType): void {
    if ("linearScale" in scale) {
      this.graphGroup
        .append("g")
        .attr("data-testid", "y axis")
        .call(axisLeft(scale.linearScale));
    } else {
      this.graphGroup
        .append("g")
        .attr("data-testid", "y axis")
        .call(axisLeft(scale.bandScale));
    }
  }

  private createTimeScale<T extends { date: Date }>({
    rangeMax,
    data,
  }: createTimeScaleParams<T>): d3.ScaleTime<number, number, never> {
    return scaleTime()
      .domain(extent(data, d => d.date) as [Date, Date])
      .range([0, rangeMax]);
  }

  private createLinearScale<T extends { count: number }>(
    data: T[],
    rangeMax: number,
  ): d3.ScaleLinear<number, number, never> {
    return scaleLinear()
      .domain([0, max(data, d => d.count)] as [number, number])
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

  drowLineSparkline(graphContainer: HTMLDivElement, data: TodoStat[]) {
    this.createSvgContainer(graphContainer);

    const groupedStats = group(data, d => d.state);

    const statsKeys = groupedStats.keys();
    const count = statsKeys.toArray().length;
    const tickCount = caculateTickCount(
      this.dateDomainBase,
      count,
      data.length,
    );

    const { innerWidth, innerHeight } = caculateGraphLayout(
      this.width,
      this.height,
      this.graphMargin,
    );

    const x_scale = this.createTimeScale({
      rangeMax: innerWidth,
      data,
    });
    this.setXAxis(x_scale, tickCount, innerHeight);

    const y_scale = this.createLinearScale(data, innerHeight);
    this.setYAxis({ type: "linearScale", linearScale: y_scale });

    const color_scale = this.createColorScale();

    const lineGenerator = line<DatDataPoint>()
      .defined(d => d.count !== null)
      .x(d => x_scale(d.date))
      .y(d => y_scale(d.count));

    this.setLineDataset(groupedStats, color_scale, lineGenerator);
  }
}
