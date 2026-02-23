"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ILineGraphData } from "@/types/schema";
import { LineGraph } from "@/utils/graph/line/originGraph";

export default function DailyActiveTodoLineGraph({
  stats,
  dateDomainBase = "week",
}: {
  stats: ILineGraphData[];
  dateDomainBase?: "week" | "month" | "year";
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
    lineGraph.drowLineGraph(graphContainer, stats);

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
