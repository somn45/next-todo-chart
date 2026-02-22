"use client";

import * as d3 from "d3";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import useDrowTimelineSparkline from "../../hooks/useDrowTimelineSparkline";
import { useEffect, useRef } from "react";
import { BandSparkline } from "@/utils/graph/bandGraph";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";

interface TimelineSparklineProps {
  todos: (LookupedTodo & WithStringifyId)[];
  dateDomainBase?: "week" | "month" | "year";
}

const GRAPH_WIDTH = 400;
const GRAPH_HEIGHT = 300;

export default function TimeLineSparkline({
  todos,
  dateDomainBase = "week",
}: TimelineSparklineProps) {
  const [, , timelineSparklineRef] = useDrowTimelineSparkline({
    outerWidth: GRAPH_WIDTH,
    outerHeight: GRAPH_HEIGHT,
    data: todos,
    dateDomainBase,
  });
  const bandSparklineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = bandSparklineRef.current;
    if (!container) return;

    const graphMargin = { top: 80, left: 100, bottom: 20, right: 100 };

    const bandSparkline = new BandSparkline(
      GRAPH_WIDTH,
      GRAPH_HEIGHT,
      graphMargin,
      dateDomainBase,
      ["할 일", "진행 중", "완료"],
      ["#3498DB", "#FFA500", "#2ECC71"],
    );

    const { innerWidth, innerHeight } = bandSparkline.caculateGraphLayout();

    bandSparkline.createSvgContainer(container);

    const startOfPeriod = getStartOfPeriod(dateDomainBase || "week");
    const endOfPeriod = getEndOfPeriod(dateDomainBase || "week");

    const x_scale = bandSparkline.createTimeScale({
      rangeMax: innerWidth,
      timeScaleDomain: [startOfPeriod, endOfPeriod],
    });
    bandSparkline.setXAxis(x_scale, 8, innerHeight);

    const y_scale = bandSparkline.createBandScale(
      todos.map(todo => ({ text: todo.content.textField })),
      innerHeight,
      0.2,
    );
    bandSparkline.setYAxis({ type: "bandScale", bandScale: y_scale });

    const color_scale = bandSparkline.createColorScale();

    bandSparkline.drowBandGraph(
      { x: x_scale, y: y_scale, color: color_scale },
      todos,
    );

    return () => {
      d3.select(container).selectAll("*").remove();
    };
  }, [dateDomainBase]);

  return (
    <>
      <div ref={bandSparklineRef}></div>
    </>
  );
}
