import * as d3 from "d3";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import {
  addTitle,
  createBandScale,
  createColorScale,
  createLegend,
  createSVGContainer,
  createTimeScale,
  setLegendItems,
  setXAxis,
} from "@/utils/graph";
import { RefObject, useEffect, useRef, useState } from "react";
import caculateBandLength from "../_utils/caculateBandLength";
import {
  getCurrentWeekEndDate,
  getCurrentWeekStartDate,
} from "@/utils/date/getDateInCurrentDate";
import { caculateGraphLayout } from "@/utils/graph/caculateGraphLayout";

interface TimeBasedBandScale {
  x_scale: d3.ScaleTime<number, number, never> | null;
  y_scale: d3.ScaleBand<string> | null;
}

type GraphConfig = {
  outerWidth: number;
  outerHeight: number;
  data: (LookupedTodo & WithStringifyId)[];
};

type useDrowBandGraphType = (
  graphConfig: GraphConfig,
) => [
  d3.Selection<SVGGElement, unknown, null, undefined> | null,
  TimeBasedBandScale,
  RefObject<HTMLDivElement | null>,
];

const useDrowBandGraph: useDrowBandGraphType = graphConfig => {
  const [svgContainer, setSvgContainer] = useState<d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const [graphScale, setGraphScale] = useState<TimeBasedBandScale>({
    x_scale: null,
    y_scale: null,
  });
  const bandGraphWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = bandGraphWrapperRef.current;
    if (!container) return;

    const { outerWidth, outerHeight, data } = graphConfig;
    const graphMargin = { top: 80, left: 100, bottom: 20, right: 100 };
    const { innerWidth, innerHeight, titleStartOffset, legendStartOffset } =
      caculateGraphLayout(outerWidth, outerHeight, graphMargin);

    const svg = createSVGContainer(
      { width: outerWidth, height: outerHeight, margin: graphMargin },
      container,
    );

    console.log(titleStartOffset);
    addTitle(svg, titleStartOffset, -50, "금주 투두 진행 타임라인");

    const legend = createLegend(svg, legendStartOffset);

    const colors = ["#3498DB", "#FFA500", "#2ECC71"];
    const texts = ["할 일", "진행 중", "완료"];
    const legendInitCoord = {
      x: 0,
      y: 0,
      textX: 12,
      textY: 4,
    };

    setLegendItems(
      "circle",
      legend,
      { radius: 5 },
      legendInitCoord,
      colors,
      texts,
    );

    const currentWeekStartDate = getCurrentWeekStartDate();
    const currentWeekEndDate = getCurrentWeekEndDate();

    const x_scale = createTimeScale({
      rangeMax: innerWidth,
      timeScaleDomain: [currentWeekStartDate, currentWeekEndDate],
    });
    setXAxis(svg, x_scale, 8, innerHeight);

    const y_scale = createBandScale(
      data.map(todo => ({ text: todo.content.textField })),
      innerHeight,
      0.2,
    );
    svg.append("g").attr("data-testid", "y axis").call(d3.axisLeft(y_scale));

    const color_scale = createColorScale(texts, colors);

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("data-testid", "band")
      .attr("fill", d => color_scale(d.content.state))
      .attr("x", d => {
        if (
          currentWeekStartDate.getTime() >
          new Date(d.content.createdAt).getTime()
        ) {
          return x_scale(currentWeekStartDate);
        }
        return x_scale(new Date(d.content.createdAt));
      })
      .attr("y", d => y_scale(d.content.textField)!)
      .attr("width", d =>
        caculateBandLength(
          d.content,
          { x_scale },
          { domainStart: currentWeekStartDate, domainEnd: currentWeekEndDate },
        ),
      )
      .attr("height", y_scale.bandwidth());

    setSvgContainer(svg);
    setGraphScale({ x_scale, y_scale });
    return () => {
      d3.select(container).selectAll("*").remove();
    };
  }, []);

  return [svgContainer, graphScale, bandGraphWrapperRef];
};

export default useDrowBandGraph;
