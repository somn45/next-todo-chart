import * as d3 from "d3";
import { formatByISO8601 } from "../date/formatByISO8601";

// x 축을 svg 컨테이너에 set
export const setXAxis = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.ScaleTime<number, number, never>,
  tickCount: number,
  height: number,
) => {
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(
      d3
        .axisBottom(scale)
        .ticks(tickCount)
        .tickFormat((d, _) => formatByISO8601(d)),
    );
};

// y 축을 svg 컨테이너에 set
export const setYAxis = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.ScaleLinear<number, number, never>,
) => {
  svg.append("g").call(d3.axisLeft(scale));
};
