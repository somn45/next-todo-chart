import { ILineGraphData } from "@/types/schema";
import {
  addTitle,
  createColorScale,
  createLegend,
  createLinearScale,
  createSVGContainer,
  createTimeScale,
  setLegendItems,
  setXAxis,
  setYAxis,
} from "@/utils/graph";
import { caculateGraphLayout } from "@/utils/graph/caculateGraphLayout";
import * as d3 from "d3";
import { RefObject, useEffect, useRef, useState } from "react";

type GraphConfig = {
  outerWidth: number;
  outerHeight: number;
  data: ILineGraphData[];
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

const useDrowLineGraph: useDrowLineGraphType = graphConfig => {
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
  const lineGraphWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = lineGraphWrapperRef.current;
    if (!container) return;

    const { outerWidth, outerHeight, data } = graphConfig;
    const graphMargin = { top: 80, left: 30, bottom: 20, right: 100 };
    const { innerWidth, innerHeight, titleStartOffset, legendStartOffset } =
      caculateGraphLayout(outerWidth, outerHeight, graphMargin);

    const groupedStats = d3.group(data, d => d.state);

    const svg = createSVGContainer(
      { width: outerWidth, height: outerHeight, margin: graphMargin },
      container,
    );

    addTitle(svg, titleStartOffset, -50, "최근 1주간 등록된 투두 합계");

    const legend = createLegend(svg, legendStartOffset);

    const legendMarkerSize = { width: 15, height: 2 };
    const legendInitCoord = { x: 0, y: 0, textX: 22, textY: 6 };
    const legendColors = ["black", "#3498DB", "#FFA500", "#2ECC71"];
    const legendTexts = ["투두 총합", "할 일", "진행 중", "완료"];

    setLegendItems(
      "rect",
      legend,
      legendMarkerSize,
      legendInitCoord,
      legendColors,
      legendTexts,
    );

    const x_scale = createTimeScale({ rangeMax: innerWidth, data });
    setXAxis(svg, x_scale, 7, innerHeight);

    const y_scale = createLinearScale(data, innerHeight);
    setYAxis(svg, y_scale);

    const lineGenerator = d3
      .line<DataPoint>()
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
  }, []);

  return [svgContainer, graphScale, lineGraphWrapperRef];
};

export default useDrowLineGraph;
