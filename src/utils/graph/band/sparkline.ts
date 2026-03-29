import { scaleTime, scaleBand } from "d3-scale";
import { axisLeft, axisBottom } from "d3-axis";
import { Graph } from "../graphCore/graphCore";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import caculateBandLength from "@/app/(private)/stats/_utils/caculateBandLength";
import { SerializedTodo, TodosType } from "@/types/todos/schema";
import { D3ScaleType } from "@/types/graph/schema";
import { caculateGraphLayout } from "../caculateGraphLayout";

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

  private createTimeScale({
    rangeMax,
    timeScaleDomain,
  }: createTimeScaleParams): d3.ScaleTime<number, number, never> {
    return scaleTime().domain(timeScaleDomain).range([0, rangeMax]);
  }

  private createBandScale<T extends { text: string }>(
    data: T[],
    rangeMax: number,
    padding: number,
  ): d3.ScaleBand<string> {
    return scaleBand()
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
    const { innerWidth, innerHeight } = caculateGraphLayout(
      this.width,
      this.height,
      this.graphMargin,
    );

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
