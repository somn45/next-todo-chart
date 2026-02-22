import * as d3 from "d3";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";
import { Graph } from "../graphCore/graphCore";
import { BandGraphMainContent, BandGraphSubContent } from "./interface";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import caculateBandLength from "@/app/(private)/stats/_utils/caculateBandLength";

type D3MarkerType = "circle" | "rect";

interface GraphMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface D3Layout {
  width: number;
  height: number;
  margin: GraphMargin;
}

interface legendAttr extends D3Layout {
  radius: number;
}

interface D3Coord {
  x: number;
  y: number;
  textX: number;
  textY: number;
}

interface createTimeScaleParams {
  rangeMax: number;
  timeScaleDomain: [Date, Date];
}

export class BandGraph
  extends Graph
  implements BandGraphMainContent, BandGraphSubContent
{
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
                : formatByISO8601(d),
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
  ) {
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

  addTitle(y: number, width: number, title: string): void {
    if (this.svg) {
      this.svg
        .append("text")
        .attr("aria-label", "graph title")
        .attr("x", this.width / 2)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .text(title);
    }
  }

  createLegend(
    legendStartOffset: number,
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    return this.svg!.append("g")
      .attr("data-testid", "legend list")
      .attr("class", "legend")
      .attr("transform", `translate(${legendStartOffset}, 0)`);
  }

  private setLegendCircleMarker(
    markerType: D3MarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    radius: number,
    coord: Pick<D3Coord, "x" | "y">,
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
    coord: Pick<D3Coord, "x" | "y">,
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

  setLegendItems(
    markerType: D3MarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    markerLayout: Partial<Omit<legendAttr, "margin">>,
    initCoord: D3Coord,
  ): void {
    const radius = markerLayout.radius ?? 0;

    const legendContents = this.colors.map((color, i) => [
      color,
      this.texts[i],
    ]);
    legendContents.forEach((content, i) => {
      const [color, text] = content;
      const { x, y, textX, textY } = initCoord;

      const coord = {
        x,
        y: y + 25 * i,
      };
      const textCoord = {
        x: textX,
        y: textY + 25 * i,
      };

      this.setLegendCircleMarker(markerType, legend, radius, coord, color);

      this.setLegendText(legend, textCoord, text);
    });
  }
}
