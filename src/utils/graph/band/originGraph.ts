import { scaleTime, scaleBand, ScaleTime, ScaleBand } from "d3-scale";
import { axisLeft, axisBottom } from "d3-axis";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";
import { Graph } from "../graphCore/graphCore";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import caculateBandLength from "@/app/(private)/stats/_utils/caculateBandLength";
import { SerializedTodo, StateType, TodosType } from "@/types/todos/schema";
import {
  D3ScaleType,
  DataDomainBaseType,
  GraphMargin,
  LegendMarkerLayout,
  LegendMarkerType,
  LegendUnitInitCoord,
} from "@/types/graph/schema";
import { caculateGraphLayout } from "../caculateGraphLayout";

interface GraphOptions {
  width: number;
  height: number;
  margin: GraphMargin;
  dateDomainBase: DataDomainBaseType;
  texts: StateType[];
  colors: string[];
  isMobile?: boolean;
}

export class BandGraph extends Graph {
  private _xScale: ScaleTime<number, number, never> | undefined = undefined;
  private _yScale: ScaleBand<string> | undefined = undefined;

  constructor(
    options: GraphOptions,
    private data: Array<TodosType & SerializedTodo>,
  ) {
    super(options);
    this.data = data;
  }

  set xScale(timeScale: ScaleTime<number, number, never>) {
    this._xScale = timeScale;
  }

  get xScale(): ScaleTime<number, number, never> {
    if (!this._xScale)
      throw new Error("생성된 시간 기반 스케일이 존재하지 않습니다.");
    return this._xScale;
  }

  set yScale(bandScale: ScaleBand<string>) {
    this._yScale = bandScale;
  }

  get yScale() {
    if (!this._yScale)
      throw new Error("생성된 밴드 기반 스케일이 존재하지 않습니다.");
    return this._yScale;
  }

  protected setXAxis(
    scale: d3.ScaleTime<number, number, never>,
    tickCount: number,
    innerHeight: number,
  ): void {
    if (this.options.isMobile) {
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
        .call(
          axisLeft(scale.bandScale).tickFormat(d => {
            return d.length > 5 ? `${d.slice(0, 5)}..` : d;
          }),
        );
    }
  }

  private setBandDataset(scale: {
    color: d3.ScaleOrdinal<string, string, never>;
  }) {
    const startOfPeriod = getStartOfPeriod(
      this.options.dateDomainBase || "week",
    );
    const endOfPeriod = getEndOfPeriod(this.options.dateDomainBase || "week");

    this.graphGroup
      .selectAll("rect")
      .data(this.data)
      .join("rect")
      .attr("class", "band")
      .attr("data-testid", "band")
      .attr("fill", d => scale.color(d.content.state))
      .attr("x", d => {
        if (startOfPeriod.getTime() > new Date(d.content.createdAt).getTime()) {
          return this.xScale(startOfPeriod);
        }
        return this.xScale(new Date(d.content.createdAt));
      })
      .attr("y", d => this.yScale(d.content.textField)!)
      .attr("width", d =>
        caculateBandLength(
          d.content,
          { x_scale: this.xScale },
          { domainStart: startOfPeriod, domainEnd: endOfPeriod },
        ),
      )
      .attr("height", this.yScale.bandwidth());
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
    if (this.options.isMobile) {
      return this.svg.append("g");
    }
    return this.svg!.append("g")
      .attr("data-testid", "legend list")
      .attr("class", "legend")
      .attr("transform", `translate(${legendStartOffset}, 0)`);
  }

  private setLegendCircleMarker(
    markerType: LegendMarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    radius: number,
    coord: Pick<LegendUnitInitCoord, "x" | "y">,
    color: string,
  ) {
    const { x, y } = coord;

    legend
      .append(markerType)
      .attr("class", "legendCategory")
      .attr("data-testid", "legend category")
      .attr("r", radius)
      .attr("cx", x)
      .attr("cy", y)
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
    if (this.options.isMobile) return;

    const radius = markerLayout.radius ?? 0;

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

      this.setLegendCircleMarker(markerType, legend, radius, coord, color);

      this.setLegendText(legend, textCoord, text);
    });
  }

  resizeGraphWidth(resizedWidth: number) {
    this.options.width = resizedWidth;
    this.svg.attr("width", resizedWidth);
    this.graphGroup.attr("width", resizedWidth);

    const { innerWidth, titleStartOffset, legendStartOffset } =
      caculateGraphLayout(
        resizedWidth,
        this.options.height,
        this.options.margin,
      );

    const startOfPeriod = getStartOfPeriod(
      this.options.dateDomainBase || "week",
    );
    const endOfPeriod = getEndOfPeriod(this.options.dateDomainBase || "week");

    this.xScale.domain([startOfPeriod, endOfPeriod]).range([0, innerWidth]);
    this.graphGroup
      .select<SVGGElement>(".xAxis")
      .call(axisBottom(this.xScale).ticks(3));

    const title = this.svg.select(".title");
    title.attr("x", titleStartOffset);

    const legend = this.svg.select(".legend");
    legend
      .attr("transform", "translate(0, 0)")
      .attr("transform", `translate(${legendStartOffset}, 0)`);

    this.graphGroup
      .selectAll(".band")
      .data(this.data)
      .join("rect")
      .attr("x", d => {
        if (startOfPeriod.getTime() > new Date(d.content.createdAt).getTime()) {
          return this.xScale(startOfPeriod);
        }
        return this.xScale(new Date(d.content.createdAt));
      })
      .attr("width", d =>
        caculateBandLength(
          d.content,
          { x_scale: this.xScale },
          { domainStart: startOfPeriod, domainEnd: endOfPeriod },
        ),
      );
  }

  drowBandGraph(graphContainer: HTMLDivElement) {
    this.createSvgContainer(graphContainer);

    const { innerWidth, innerHeight, titleStartOffset, legendStartOffset } =
      caculateGraphLayout(
        this.options.width,
        this.options.height,
        this.options.margin,
      );

    this.addTitle(titleStartOffset, "금주 투두 진행 타임라인");

    const legendInitCoord = {
      x: 0,
      y: 0,
      textX: 12,
      textY: 4,
    };

    const legend = this.createLegend(legendStartOffset);
    if (!legend) return;
    this.setLegendItems("circle", legend, { radius: 5 }, legendInitCoord);

    const startOfPeriod = getStartOfPeriod(
      this.options.dateDomainBase || "week",
    );
    const endOfPeriod = getEndOfPeriod(this.options.dateDomainBase || "week");

    this.xScale = scaleTime()
      .domain([startOfPeriod, endOfPeriod])
      .range([0, innerWidth]);
    if (this.options.isMobile) this.setXAxis(this.xScale, 2, innerHeight);
    else this.setXAxis(this.xScale, 8, innerHeight);

    this.yScale = scaleBand()
      .domain(
        this.data
          .map(todo => ({ text: todo.content.textField }))
          .map(content => content.text),
      )
      .range([0, innerHeight])
      .padding(0.2);
    this.setYAxis({
      type: "bandScale",
      bandScale: this.yScale,
    });

    const color_scale = this.createColorScale();
    this.setBandDataset({
      color: color_scale,
    });
  }
}
