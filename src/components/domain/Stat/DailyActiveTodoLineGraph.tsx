"use client";

import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";
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
  MOBILE_GRAPH_MIN_WIDTH,
} from "@/constants/graph";

export default function DailyActiveTodoLineGraph({
  stats,
  dateDomainBase = "week",
}: {
  stats: TodoStat[];
  dateDomainBase?: DataDomainBaseType;
}) {
  const [windowSize, setWindowSize] = useState(0);

  const lineGraphWrapperRef = useRef<HTMLDivElement | null>(null);
  const toolTipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    if (windowSize === 0) return setWindowSize(screen.width);

    const graphContainer = lineGraphWrapperRef.current;
    if (!graphContainer) return;

    let lineGraph: LineGraph;

    if (windowSize <= 767) {
      const graphContainerWidth =
        windowSize !== 0 ? windowSize - 20 : MOBILE_GRAPH_MIN_WIDTH;

      lineGraph = new LineGraph(
        graphContainerWidth,
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

    window.addEventListener("resize", handleResize);

    return () => {
      select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase, windowSize]);

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
