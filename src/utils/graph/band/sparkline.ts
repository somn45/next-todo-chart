import { scaleTime, scaleBand, ScaleTime, ScaleBand } from "d3-scale";
import { axisLeft, axisBottom } from "d3-axis";
import { Graph } from "../graphCore/graphCore";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import caculateBandLength from "@/app/(private)/stats/_utils/caculateBandLength";
import { SerializedTodo, StateType, TodosType } from "@/types/todos/schema";
import {
  D3ScaleType,
  DateDomainBaseType,
  GraphMargin,
} from "@/types/graph/schema";
import { caculateGraphLayout } from "../caculateGraphLayout";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";

interface GraphOptions {
  width: number;
  height: number;
  margin: GraphMargin;
  dateDomainBase: DateDomainBaseType;
  texts: StateType[];
  colors: string[];
}

export class BandSparkline extends Graph {
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

  private setBandDataset(
    scale: {
      color: d3.ScaleOrdinal<string, string, never>;
    },
    data: Array<TodosType & SerializedTodo>,
  ): void {
    const startOfPeriod = getStartOfPeriod(
      this.options.dateDomainBase || "week",
    );
    const endOfPeriod = getEndOfPeriod(this.options.dateDomainBase || "week");

    this.graphGroup
      .selectAll("rect")
      .data(data)
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

    const startOfPeriod = getStartOfPeriod(
      this.options.dateDomainBase || "week",
    );
    const endOfPeriod = getEndOfPeriod(this.options.dateDomainBase || "week");

    this.xScale.domain([startOfPeriod, endOfPeriod]).range([0, innerWidth]);
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

  drowBandSparkline(
    graphContainer: HTMLDivElement,
    data: Array<TodosType & SerializedTodo>,
  ) {
    const { innerWidth, innerHeight } = caculateGraphLayout(
      this.options.width,
      this.options.height,
      this.options.margin,
    );

    this.createSvgContainer(graphContainer);

    const startOfPeriod = getStartOfPeriod(
      this.options.dateDomainBase || "week",
    );
    const endOfPeriod = getEndOfPeriod(this.options.dateDomainBase || "week");

    this.xScale = scaleTime()
      .domain([startOfPeriod, endOfPeriod])
      .range([0, innerWidth]);
    this.setXAxis(this.xScale, 8, innerHeight);

    this.yScale = scaleBand()
      .domain(
        this.data
          .map(todo => ({ text: todo.content.textField }))
          .map(content => content.text),
      )
      .range([0, innerHeight])
      .padding(0.2);
    this.setYAxis({ type: "bandScale", bandScale: this.yScale });

    const color_scale = this.createColorScale();

    this.setBandDataset({ color: color_scale }, data);
  }
}
