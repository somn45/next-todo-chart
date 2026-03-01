import * as d3 from "d3";
import { Graph } from "../graphCore/graphCore";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import caculateBandLength from "@/app/(private)/stats/_utils/caculateBandLength";
import { SerializedTodo, TodosType } from "@/types/todos/schema";

interface createTimeScaleParams {
  rangeMax: number;
  timeScaleDomain: [Date, Date];
}

export class BandSparkline extends Graph {
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
              : new Date(d.toString()).getDate().toString(),
          ),
      );
  }

  protected setYAxis(
    scale:
      | {
          type: "linearScale";
          linearScale: d3.ScaleLinear<number, number, never>;
        }
      | { type: "bandScale"; bandScale: d3.ScaleBand<string> },
  ): void {
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

  private createTimeScale({
    rangeMax,
    timeScaleDomain,
  }: createTimeScaleParams): d3.ScaleTime<number, number, never> {
    return d3.scaleTime().domain(timeScaleDomain).range([0, rangeMax]);
  }

  private createBandScale<T extends { text: string }>(
    data: T[],
    rangeMax: number,
    padding: number,
  ): d3.ScaleBand<string> {
    return d3
      .scaleBand()
      .domain(data.map(content => content.text))
      .range([0, rangeMax])
      .padding(padding);
  }

  private setBandDataset(
    scale: {
      x: d3.ScaleTime<number, number, never>;
      y: d3.ScaleBand<string>;
      color: d3.ScaleOrdinal<string, string, never>;
    },
    data: Array<TodosType & SerializedTodo>,
  ): void {
    const startOfPeriod = getStartOfPeriod(this.dateDomainBase || "week");
    const endOfPeriod = getEndOfPeriod(this.dateDomainBase || "week");

    this.graphGroup
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("data-testid", "band")
      .attr("fill", d => scale.color(d.content.state))
      .attr("x", d => {
        if (startOfPeriod.getTime() > new Date(d.content.createdAt).getTime()) {
          return scale.x(startOfPeriod);
        }
        return scale.x(new Date(d.content.createdAt));
      })
      .attr("y", d => scale.y(d.content.textField)!)
      .attr("width", d =>
        caculateBandLength(
          d.content,
          { x_scale: scale.x },
          { domainStart: startOfPeriod, domainEnd: endOfPeriod },
        ),
      )
      .attr("height", scale.y.bandwidth());
  }

  drowBandSparkline(
    graphContainer: HTMLDivElement,
    data: Array<TodosType & SerializedTodo>,
  ) {
    const { innerWidth, innerHeight } = this.caculateGraphLayout();

    this.createSvgContainer(graphContainer);

    const startOfPeriod = getStartOfPeriod(this.dateDomainBase || "week");
    const endOfPeriod = getEndOfPeriod(this.dateDomainBase || "week");

    const x_scale = this.createTimeScale({
      rangeMax: innerWidth,
      timeScaleDomain: [startOfPeriod, endOfPeriod],
    });
    this.setXAxis(x_scale, 8, innerHeight);

    const y_scale = this.createBandScale(
      data.map(todo => ({ text: todo.content.textField })),
      innerHeight,
      0.2,
    );
    this.setYAxis({ type: "bandScale", bandScale: y_scale });

    const color_scale = this.createColorScale();

    this.setBandDataset({ x: x_scale, y: y_scale, color: color_scale }, data);
  }
}
