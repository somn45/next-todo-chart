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
import { RefObject, useEffect, useState } from "react";
import caculateBandLength from "../_utils/caculateBandLegnth";

interface ChartMargin {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

interface TimeBasedBandScale {
  x_scale: d3.ScaleTime<number, number, never> | null;
  y_scale: d3.ScaleBand<string> | null;
}

type GraphConfig = {
  width: number;
  height: number;
  margin: ChartMargin;
  data: (LookupedTodo & WithStringifyId)[];
  graphRef: RefObject<HTMLDivElement | null>;
};

type useDrowBandGraphType = (
  graphConfig: GraphConfig,
) => [
  d3.Selection<SVGSVGElement, unknown, null, undefined> | null,
  TimeBasedBandScale,
];

const useDrowBandGraph: useDrowBandGraphType = graphConfig => {
  const [svgContainer, setSvgContainer] = useState<d3.Selection<
    SVGSVGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const [graphScale, setGraphScale] = useState<TimeBasedBandScale>({
    x_scale: null,
    y_scale: null,
  });

  useEffect(() => {
    const { width, height, margin, data, graphRef } = graphConfig;

    if (graphRef.current!.hasChildNodes()) return;

    const svg = createSVGContainer({ width, height, margin }, graphRef.current);

    addTitle(svg, width / 2, -50, "금주 투두 진행 타임라인");

    const legend = createLegend(svg, width - 50);

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

    const currentDay = new Date().getDay();
    const currentWeekArray = Array.from(
      { length: 7 },
      (_, i) => i - currentDay,
    );
    const currentWeek = currentWeekArray.map(ele => {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      return new Date(Date.now() + ONE_DAY * ele);
    });

    const currentWeekFirstDay = new Date(
      currentWeek[0].getFullYear(),
      currentWeek[0].getMonth(),
      currentWeek[0].getDate(),
      0,
      0,
    );

    const currentWeekLastDay = new Date(
      currentWeek[currentWeek.length - 1].getFullYear(),
      currentWeek[currentWeek.length - 1].getMonth(),
      currentWeek[currentWeek.length - 1].getDate(),
      23,
      59,
    );

    const x_scale = createTimeScale({
      rangeMax: width - 80,
      timeScaleDomain: [currentWeekFirstDay, currentWeekLastDay],
    });
    setXAxis(svg, x_scale, 8, height);

    const y_scale = createBandScale(
      data.map(todo => ({ text: todo.content.textField })),
      height,
      0.2,
    );
    svg.append("g").call(d3.axisLeft(y_scale));

    const color_scale = createColorScale(texts, colors);

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("fill", d => color_scale(d.content.state))
      .attr("x", d => {
        if (
          currentWeekFirstDay.getTime() >
          new Date(d.content.createdAt).getTime()
        ) {
          return x_scale(currentWeekFirstDay);
        }
        return x_scale(new Date(d.content.createdAt));
      })
      .attr("y", d => y_scale(d.content.textField)!)
      .attr("width", d =>
        caculateBandLength(
          d.content,
          { x_scale },
          { domainStart: currentWeekFirstDay, domainEnd: currentWeekLastDay },
        ),
      )
      .attr("height", y_scale.bandwidth());

    setSvgContainer(svg);
    setGraphScale({ x_scale, y_scale });
  }, []);

  return [svgContainer, graphScale];
};

export default useDrowBandGraph;
