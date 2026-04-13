"use client";

import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import { LineGraph } from "@/utils/graph/line/originGraph";
import { LineGraphMouseEvent } from "@/utils/graph/line/event";
import { DataDomainBaseType } from "@/types/graph/schema";
import { TodoStat } from "@/types/stats/schema";
import {
  DAT_GRAPH_MARGIN,
  DAT_LEGEND_COLORS,
  DAT_LEGEND_TEXTS,
  DAT_MOBILE_GRAPH_MARGIN,
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  MOBILE_GRAPH_WIDTH,
} from "@/constants/graph";

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
    const graphContainer = lineGraphWrapperRef.current;
    if (!graphContainer) return;

    let lineGraph: LineGraph;

    if (screen.width <= 767) {
      lineGraph = new LineGraph(
        MOBILE_GRAPH_WIDTH,
        GRAPH_HEIGHT,
        DAT_MOBILE_GRAPH_MARGIN,
        "week",
        DAT_LEGEND_TEXTS,
        DAT_LEGEND_COLORS,
        true,
      );
    } else {
      lineGraph = new LineGraph(
        GRAPH_WIDTH,
        GRAPH_HEIGHT,
        DAT_GRAPH_MARGIN,
        "week",
        DAT_LEGEND_TEXTS,
        DAT_LEGEND_COLORS,
        false,
      );
    }

    const scale = lineGraph.drowLineGraph(graphContainer, stats);
    if (!scale) return;
    const graphGroup = lineGraph.graphGroup;
    if (!toolTipRef.current) return;

    const lineGraphMouseEvent = new LineGraphMouseEvent(
      { width: GRAPH_WIDTH, height: GRAPH_HEIGHT, margin: DAT_GRAPH_MARGIN },
      graphGroup,
      { x: scale.x, y: scale.y },
      stats,
      toolTipRef.current,
    );
    lineGraphMouseEvent.handleGraphMouseEvent();

    return () => {
      select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          ref={toolTipRef}
          data-testid="tooltip"
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
