import { ILineGraphData } from "@/types/schema";
import {
  createColorScale,
  createLinearScale,
  createSVGContainer,
  createTimeScale,
  setYAxis,
} from "@/utils/graph";
import { setSparklineXAxis } from "@/utils/graph/axis";
import { caculateGraphLayout } from "@/utils/graph/caculateGraphLayout";
import * as d3 from "d3";
import { RefObject, useEffect, useRef, useState } from "react";

type GraphConfig = {
  outerWidth: number;
  outerHeight: number;
  data: ILineGraphData[];
  dateDomainBase?: "week" | "month" | "year";
};

interface DataPoint {
  date: Date;
  count: number;
}

interface TimeBasedLinearScale {
  x_scale: d3.ScaleTime<number, number, never> | null;
  y_scale: d3.ScaleLinear<number, number, never> | null;
}

type useDrowLineGraphType = (
  GraphConfig: GraphConfig,
) => [
  d3.Selection<SVGGElement, unknown, null, undefined> | null,
  TimeBasedLinearScale,
  RefObject<HTMLDivElement | null>,
];

const useDrowLineGraphSparkline: useDrowLineGraphType = graphConfig => {
  const [svgContainer, setSvgContainer] = useState<d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const [graphScale, setGraphScale] = useState<TimeBasedLinearScale>({
    x_scale: null,
    y_scale: null,
  });
  const lineGraphSparklineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = lineGraphSparklineRef.current;
    if (!container) return;

    const { outerWidth, outerHeight, data, dateDomainBase } = graphConfig;
    const graphMargin = { top: 80, left: 30, bottom: 20, right: 100 };
    const { innerWidth, innerHeight } = caculateGraphLayout(
      outerWidth,
      outerHeight,
      graphMargin,
    );

    const groupedStats = d3.group(data, d => d.state);

    const svg = createSVGContainer(
      { width: outerWidth, height: outerHeight, margin: graphMargin },
      container,
    );

    const x_scale = createTimeScale({ rangeMax: innerWidth, data });
    setSparklineXAxis(svg, x_scale, 7, innerHeight, dateDomainBase);

    const y_scale = createLinearScale(data, innerHeight);
    setYAxis(svg, y_scale);

    const lineGenerator = d3
      .line<DataPoint>()
      .defined(d => d.count !== null)
      .x(d => x_scale(d.date))
      .y(d => y_scale(d.count));

    const statsKeys = groupedStats.keys();

    const color = createColorScale(statsKeys, [
      "#000000",
      "#3498DB",
      "#FFA500",
      "#2ECC71",
    ]);

    svg
      .selectAll(".line")
      .data(groupedStats.entries())
      .enter()
      .append("path")
      .attr("data-testid", "line")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 2.5)
      .attr("d", d => lineGenerator(d[1]));

    setSvgContainer(svg);
    setGraphScale({ x_scale, y_scale });
    return () => {
      d3.select(container).selectAll("*").remove();
    };
  }, [graphConfig.dateDomainBase]);

  return [svgContainer, graphScale, lineGraphSparklineRef];
};

export default useDrowLineGraphSparkline;
