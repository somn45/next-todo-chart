"use client";

import * as d3 from "d3";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import { BandGraph } from "@/utils/graph/graph";
import { useEffect, useRef } from "react";

interface TimeLineProps {
  todos: (LookupedTodo & WithStringifyId)[];
  dateDomainBase?: "week" | "month" | "year";
}

const GRAPH_WIDTH = 700;
const GRAPH_HEIGHT = 400;
const GRAPH_MARGIN = { top: 80, left: 100, bottom: 20, right: 100 };

export default function TodoTimeline({
  todos,
  dateDomainBase = "week",
}: TimeLineProps) {
  const bandGraphWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const graphContainer = bandGraphWrapperRef.current;

    const bandGraph = new BandGraph(
      GRAPH_WIDTH,
      GRAPH_HEIGHT,
      GRAPH_MARGIN,
      dateDomainBase,
      ["할 일", "진행 중", "완료"],
      ["#3498DB", "#FFA500", "#2ECC71"],
    );

    bandGraph.createSvgContainer(graphContainer);

    const { innerWidth, innerHeight, titleStartOffset, legendStartOffset } =
      bandGraph.caculateGraphLayout();

    bandGraph.addTitle(titleStartOffset, -50, "금주 투두 진행 타임라인");

    const legendInitCoord = {
      x: 0,
      y: 0,
      textX: 12,
      textY: 4,
    };

    const legend = bandGraph.createLegend(legendStartOffset);
    if (!legend) return;
    bandGraph.setLegendItems("circle", legend, { radius: 5 }, legendInitCoord);

    const startOfPeriod = getStartOfPeriod(dateDomainBase || "week");
    const endOfPeriod = getEndOfPeriod(dateDomainBase || "week");

    const x_scale = bandGraph.createTimeScale({
      rangeMax: innerWidth,
      timeScaleDomain: [startOfPeriod, endOfPeriod],
    });
    bandGraph.setXAxis(x_scale, 8, innerHeight);

    const y_scale = bandGraph.createBandScale(
      todos.map(todo => ({ text: todo.content.textField })),
      innerHeight,
      0.2,
    );
    bandGraph.setYAxis({
      type: "bandScale",
      bandScale: y_scale,
    });

    const color_scale = bandGraph.createColorScale();
    bandGraph.drowBandGraph(todos, {
      x: x_scale,
      y: y_scale,
      color: color_scale,
    });

    return () => {
      d3.select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase]);

  return (
    <>
      <div ref={bandGraphWrapperRef}></div>
    </>
  );
}
