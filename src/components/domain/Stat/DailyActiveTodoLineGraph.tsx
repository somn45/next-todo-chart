"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { LineGraph } from "@/utils/graph/line/originGraph";
import { LineGraphMouseEvent } from "@/utils/graph/line/event";
import { DataDomainBaseType } from "@/types/graph/schema";
import { TodoStat } from "@/types/stats/schema";

export default function DailyActiveTodoLineGraph({
  stats,
  dateDomainBase = "week",
}: {
  stats: TodoStat[];
  dateDomainBase?: DataDomainBaseType;
}) {
  const lineGraphWrapperRef = useRef<HTMLDivElement | null>(null);
  const toolTipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const GRAPH_WIDTH = 700;
    const GRAPH_HEIGHT = 400;
    const graphMargin = { top: 80, left: 30, bottom: 20, right: 100 };

    const lineGraph = new LineGraph(
      GRAPH_WIDTH,
      GRAPH_HEIGHT,
      graphMargin,
      "week",
      ["총합", "할 일", "진행 중", "완료"],
      ["#000000", "#3498DB", "#FFA500", "#2ECC71"],
    );

    const graphContainer = lineGraphWrapperRef.current;
    if (!graphContainer) return;
    const scale = lineGraph.drowLineGraph(graphContainer, stats);
    if (!scale) return;
    const graphGroup = lineGraph.graphGroup;
    if (!toolTipRef.current) return;

    const lineGraphMouseEvent = new LineGraphMouseEvent(
      { width: GRAPH_WIDTH, height: GRAPH_HEIGHT, margin: graphMargin },
      graphGroup,
      { x: scale.x, y: scale.y },
      stats,
      toolTipRef.current,
    );
    lineGraphMouseEvent.handleGraphMouseEvent();

    return () => {
      d3.select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          ref={toolTipRef}
          className="tooltip"
          style={{
            position: "absolute",
            opacity: 0,
            background: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "14px",
            zIndex: 100,
            pointerEvents: "none",
          }}
        ></div>
        <div ref={lineGraphWrapperRef}></div>
      </div>
    </>
  );
}
