import { scaleTime, scaleLinear, ScaleTime, ScaleLinear } from "d3-scale";
import { axisLeft, axisBottom } from "d3-axis";
import { max, extent, group } from "d3-array";
import { line } from "d3-shape";
import { Graph } from "../graphCore/graphCore";
import { caculateTickCount } from "../caculateTickCount";
import { TodoStat } from "@/types/stats/schema";
import {
  D3ScaleType,
  DateDomainBaseType,
  DatDataPoint,
  GraphMargin,
} from "@/types/graph/schema";
import { caculateGraphLayout } from "../caculateGraphLayout";
import { StateType } from "@/types/todos/schema";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";

interface createTimeScaleParams<T extends { date: Date }> {
  rangeMax: number;
  data: T[];
}

interface GraphOptions {
  width: number;
  height: number;
  margin: GraphMargin;
  dateDomainBase: DateDomainBaseType;
  texts: StateType[];
  colors: string[];
}

export class LineSparkline extends Graph {
  private _xScale: ScaleTime<number, number, never> | undefined = undefined;
  private _yScale: ScaleLinear<number, number, never> | undefined = undefined;
  private _lineGenerator: d3.Line<DatDataPoint> | undefined = undefined;
  constructor(
    options: GraphOptions,
    private data: TodoStat[],
  ) {
    super(options);
    this.data = data;
  }

  set xScale(timeScale: ScaleTime<number, number, never>) {
    this._xScale = timeScale;
  }

  set yScale(linearScale: ScaleLinear<number, number, never>) {
    this._yScale = linearScale;
  }

  get xScale(): ScaleTime<number, number, never> {
    if (!this._xScale)
      throw new Error("생성된 시간 기반 스케일이 존재하지 않습니다.");
    return this._xScale;
  }

  get yScale() {
    if (!this._yScale)
      throw new Error("생성된 선형 기반 스케일이 존재하지 않습니다.");
    return this._yScale;
  }

  set lineGenerator(d3Line: d3.Line<DatDataPoint>) {
    this._lineGenerator = d3Line;
  }

  get lineGenerator() {
    if (!this._lineGenerator)
      throw new Error("생성된 라인 생성 객체가 존재하지 않습니다.");
    return this._lineGenerator;
  }

  protected setXAxis(
    scale: d3.ScaleTime<number, number, never>,
    tickCount: number,
    innerHeight: number,
  ): void {
    if (this.isMobile) {
      this.graphGroup
        .append("g")
        .attr("class", "xAxis")
        .attr("data-testid", "x axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(axisBottom(scale).ticks(3));
    }
    this.graphGroup
      .append("g")
      .attr("class", "xAxis")
      .attr("data-testid", "x axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        axisBottom(scale)
          .ticks(tickCount)
          .tickFormat(d =>
            this.options.dateDomainBase === "year"
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
  ): void {
    this.graphGroup
      .selectAll(".line")
      .data(groupedData.entries())
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("data-testid", "line")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 2.5)
      .attr("d", d => this.lineGenerator(d[1]));
  }

  resizeSparklineWidth(resizedWidth: number, windowWidth: number) {
    this.options.width = resizedWidth;
    this.svg.attr("width", resizedWidth);
    this.graphGroup.attr("width", resizedWidth);
    this.isMobile = windowWidth;

    const { innerWidth } = caculateGraphLayout(
      resizedWidth,
      this.options.height,
      this.options.margin,
    );

    this.xScale
      .domain(extent(this.data, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    if (this.isMobile) {
      this.graphGroup
        .select<SVGGElement>(".xAxis")
        .call(axisBottom(this.xScale).ticks(3));
    } else {
      axisBottom(this.xScale)
        .ticks(7)
        .tickFormat(d =>
          this.options.dateDomainBase === "year"
            ? (new Date(d.toString()).getMonth() + 1).toString()
            : formatByISO8601(d),
        );
    }

    const groupedStats = group(this.data, d => d.state);

    this.lineGenerator = line<DatDataPoint>()
      .x(d => this.xScale(d.date))
      .y(d => this.yScale(d.count));
    this.graphGroup
      .selectAll(".line")
      .data(Array.from(groupedStats))
      .join("path")
      .attr("class", "line")
      .attr("d", d => this.lineGenerator(d[1]));
  }

  drowLineSparkline(graphContainer: HTMLDivElement, data: TodoStat[]) {
    this.createSvgContainer(graphContainer);

    const groupedStats = group(data, d => d.state);

    const statsKeys = groupedStats.keys();
    const count = statsKeys.toArray().length;
    const tickCount = caculateTickCount(
      this.options.dateDomainBase,
      count,
      data.length,
    );

    const { innerWidth, innerHeight } = caculateGraphLayout(
      this.options.width,
      this.options.height,
      this.options.margin,
    );

    this.xScale = scaleTime()
      .domain(extent(data, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    this.setXAxis(this.xScale, tickCount, innerHeight);

    this.yScale = scaleLinear()
      .domain([0, max(data, d => d.count)] as [number, number])
      .range([innerHeight, 0])
      .nice(1);

    this.setYAxis({ type: "linearScale", linearScale: this.yScale });

    const color_scale = this.createColorScale();

    this.lineGenerator = line<DatDataPoint>()
      .defined(d => d.count !== null)
      .x(d => this.xScale(d.date))
      .y(d => this.yScale(d.count));

    this.setLineDataset(groupedStats, color_scale);
  }
}
