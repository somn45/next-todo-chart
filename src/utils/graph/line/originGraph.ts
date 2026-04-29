import { scaleTime, scaleLinear, ScaleTime, ScaleLinear } from "d3-scale";
import { axisLeft, axisBottom } from "d3-axis";
import { max, extent, group } from "d3-array";
import { line } from "d3-shape";
import { Graph } from "../graphCore/graphCore";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";
import { caculateTickCount } from "../caculateTickCount";
import { TodoStat } from "@/types/stats/schema";
import {
  DataDomainBaseType,
  DatDataPoint,
  GraphMargin,
  LegendCategoryLayout,
  LegendMarkerLayout,
  LegendMarkerType,
  LegendUnitInitCoord,
} from "@/types/graph/schema";
import { caculateGraphLayout } from "../caculateGraphLayout";
import {
  DAT_LEGEND_INIT_COORD,
  GRAPH_LEGEND_MARKER_SIZE,
} from "@/constants/graph";
import { StateType } from "@/types/todos/schema";

interface GraphOptions {
  width: number;
  height: number;
  margin: GraphMargin;
  dateDomainBase: DataDomainBaseType;
  texts: StateType[];
  colors: string[];
  isMobile?: boolean;
}

export class LineGraph extends Graph {
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
    } else {
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
                : formatByISO8601(d),
            ),
        );
    }
  }

  protected setYAxis(): void {
    this.graphGroup
      .append("g")
      .attr("data-testid", "y axis")
      .call(axisLeft(this.yScale));
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

  private addTitle(x: number, title: string): void {
    this.svg
      .append("text")
      .attr("class", "title")
      .attr("aria-label", "graph title")
      .attr("x", x)
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
      .attr("transform", `translate(${legendStartOffset}, 0)`)
      .attr("display", this.isMobile ? "none" : "block");
  }

  private setLegendRectMarker(
    markerType: LegendMarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    markerLayout: Omit<LegendCategoryLayout, "margin" | "categoryRadius">,
    coord: Pick<LegendUnitInitCoord, "x" | "y">,
    color: string,
  ): void {
    const { categoryWidth, categoryHeight } = markerLayout;
    const { x, y } = coord;

    legend
      .append(markerType)
      .attr("class", "legendCategory")
      .attr("data-testid", "legend category")
      .attr("width", categoryWidth)
      .attr("height", categoryHeight)
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
    if (this.isMobile) return;

    const markerWidth = markerLayout.width ?? 0;
    const markerHeight = markerLayout.height ?? 0;

    const legendContents = this.options.colors.map((color, i) => [
      color,
      this.options.texts[i],
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
        { categoryWidth: markerWidth, categoryHeight: markerHeight },
        coord,
        color,
      );

      this.setLegendText(legend, textCoord, text);
    });
  }

  resizeGraphWidth(resizedWidth: number, windowWidth: number) {
    this.options.width = resizedWidth;
    this.svg.attr("width", resizedWidth);
    this.graphGroup.attr("width", resizedWidth);
    this.isMobile = windowWidth;

    const { innerWidth, titleStartOffset, legendStartOffset } =
      caculateGraphLayout(
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

    const title = this.svg.select(".title");
    title.attr("x", titleStartOffset);

    const legend = this.svg.select(".legend");
    legend
      .attr("transform", "translate(0, 0)")
      .attr("transform", `translate(${legendStartOffset}, 0)`)
      .attr("display", this.isMobile ? "none" : "block");

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
      caculateGraphLayout(
        this.options.width,
        this.options.height,
        this.options.margin,
      );

    const groupedStats = group(this.data, d => d.state);

    this.addTitle(titleStartOffset, "최근 1주간 등록된 투두 합계");

    const legend = this.createLegend(legendStartOffset);
    if (!legend) return;

    this.setLegendItems(
      "rect",
      legend,
      GRAPH_LEGEND_MARKER_SIZE,
      DAT_LEGEND_INIT_COORD,
    );

    const statsKeys = groupedStats.keys();
    const stateTypeCount = statsKeys.toArray().length;
    const tickCount = caculateTickCount(
      this.options.dateDomainBase,
      stateTypeCount,
      this.data.length,
    );

    this.xScale = scaleTime()
      .domain(extent(this.data, d => d.date) as [Date, Date])
      .range([0, innerWidth]);
    this.setXAxis(this.xScale, tickCount, innerHeight);

    this.yScale = scaleLinear()
      .domain([0, max(data, d => d.count)] as [number, number])
      .range([innerHeight, 0])
      .nice(1);
    this.setYAxis();

    this.lineGenerator = line<DatDataPoint>()
      .x(d => this.xScale(d.date))
      .y(d => this.yScale(d.count));

    const color = this.createColorScale();

    this.setLineDataset(groupedStats, color);
    return { x: this.xScale, y: this.yScale };
  }
}
