import * as d3 from "d3";
import { ILineGraphData } from "@/types/schema";
import { Graph } from "../graphCore/graphCore";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";
import { caculateTickCount } from "../caculateTickCount";

interface createTimeScaleParams<T extends { date: Date }> {
  rangeMax: number;
  data: T[];
}

interface DataPoint {
  date: Date;
  count: number;
}

type linearScaleType = {
  type: "linearScale";
  linearScale: d3.ScaleLinear<number, number, never>;
};
type bandScaleType = {
  type: "bandScale";
  bandScale: d3.ScaleBand<string>;
};

export class LineSparkline extends Graph {
  protected setXAxis(
    scale: d3.ScaleTime<number, number, never>,
    tickCount: number,
    innerHeight: number,
  ): void {
    if (this.svg) {
      this.svg
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
  }

  protected setYAxis(scale: linearScaleType | bandScaleType): void {
    if (this.svg) {
      if ("linearScale" in scale) {
        this.svg
          .append("g")
          .attr("data-testid", "y axis")
          .call(d3.axisLeft(scale.linearScale));
      } else {
        this.svg
          .append("g")
          .attr("data-testid", "y axis")
          .call(d3.axisLeft(scale.bandScale));
      }
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
    groupedData: d3.InternMap<string, ILineGraphData[]>,
    color: d3.ScaleOrdinal<string, string, never>,
    lineGenerator: d3.Line<DataPoint>,
  ): void {
    if (this.svg) {
      this.svg
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
  }

  drowLineSparkline(graphContainer: HTMLDivElement, data: ILineGraphData[]) {
    this.createSvgContainer(graphContainer);

    const groupedStats = d3.group(data, d => d.state);

    const statsKeys = groupedStats.keys();
    const count = statsKeys.toArray().length;
    const tickCount = caculateTickCount(
      this.dateDomainBase,
      count,
      data.length,
    );

    const { innerWidth, innerHeight } = this.caculateGraphLayout();

    const x_scale = this.createTimeScale({
      rangeMax: innerWidth,
      data,
    });
    this.setXAxis(x_scale, tickCount, innerHeight);

    const y_scale = this.createLinearScale(data, innerHeight);
    this.setYAxis({ type: "linearScale", linearScale: y_scale });

    const color_scale = this.createColorScale();

    const lineGenerator = d3
      .line<DataPoint>()
      .defined(d => d.count !== null)
      .x(d => x_scale(d.date))
      .y(d => y_scale(d.count));

    this.setLineDataset(groupedStats, color_scale, lineGenerator);
  }
}
