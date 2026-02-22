import * as d3 from "d3";
import { Graph } from "../graphCore/graphCore";
import { BandGraphMainContent } from "./interface";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import caculateBandLength from "@/app/(private)/stats/_utils/caculateBandLength";

interface createTimeScaleParams {
  rangeMax: number;
  timeScaleDomain: [Date, Date];
}

export class BandSparkline extends Graph implements BandGraphMainContent {
  setXAxis(
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
                : new Date(d.toString()).getDate().toString(),
            ),
        );
    }
  }

  setYAxis(
    scale:
      | {
          type: "linearScale";
          linearScale: d3.ScaleLinear<number, number, never>;
        }
      | { type: "bandScale"; bandScale: d3.ScaleBand<string> },
  ): void {
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

  createTimeScale({
    rangeMax,
    timeScaleDomain,
  }: createTimeScaleParams): d3.ScaleTime<number, number, never> {
    return d3.scaleTime().domain(timeScaleDomain).range([0, rangeMax]);
  }

  createBandScale<T extends { text: string }>(
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

  setBandDataset(
    scale: {
      x: d3.ScaleTime<number, number, never>;
      y: d3.ScaleBand<string>;
      color: d3.ScaleOrdinal<string, string, never>;
    },
    data: (LookupedTodo & WithStringifyId)[],
  ): void {
    if (this.svg) {
      const startOfPeriod = getStartOfPeriod(this.dateDomainBase || "week");
      const endOfPeriod = getEndOfPeriod(this.dateDomainBase || "week");

      this.svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("data-testid", "band")
        .attr("fill", d => scale.color(d.content.state))
        .attr("x", d => {
          if (
            startOfPeriod.getTime() > new Date(d.content.createdAt).getTime()
          ) {
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
  }
}
