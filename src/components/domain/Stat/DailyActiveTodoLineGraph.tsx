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
import { MAX_MOBILE_SIZE } from "@/constants/media";

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

    const isMounted = windowSize !== 0;
    if (!isMounted) return setWindowSize(screen.width);

    const graphContainer = lineGraphWrapperRef.current;
    if (!graphContainer) return;

    let lineGraph: LineGraph;
    let graphContainerWidth = GRAPH_WIDTH;
    const isMobileSize = windowSize <= MAX_MOBILE_SIZE;

    const graphContainerMargin = isMobileSize
      ? DAT_MOBILE_GRAPH_MARGIN
      : DAT_GRAPH_MARGIN;

    if (isMobileSize) {
      graphContainerWidth = isMounted
        ? windowSize - 20
        : MOBILE_GRAPH_MIN_WIDTH;

      lineGraph = new LineGraph(
        graphContainerWidth,
        GRAPH_HEIGHT,
        graphContainerMargin,
        dateDomainBase,
        DAT_LEGEND_TEXTS,
        DAT_LEGEND_COLORS,
        true,
      );
    } else {
      lineGraph = new LineGraph(
        graphContainerWidth,
        GRAPH_HEIGHT,
        graphContainerMargin,
        dateDomainBase,
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
      {
        width: graphContainerWidth,
        height: GRAPH_HEIGHT,
        margin: graphContainerMargin,
      },
      graphGroup,
      { x: scale.x, y: scale.y },
      stats,
      toolTipRef.current,
    );
    const groupedStats = lineGraphMouseEvent.handleGraphMouseEvent();

    const { graphArea, tooltipSelection } = lineGraphMouseEvent;

    let timer: NodeJS.Timeout | null;
    const THORTTLING_DELAY = 50;

    graphArea
      .on("mouseover", () =>
        lineGraphMouseEvent.handleMouseOver(tooltipSelection),
      )
      .on("mousemove", (event: MouseEvent) => {
        if (!timer) {
          const latestEvent = event;
          const target = event.currentTarget;
          if (!target) return;
          timer = setTimeout(() => {
            lineGraphMouseEvent.handleMouseMove(
              groupedStats,
              { x_scale: scale.x, y_scale: scale.y },
              latestEvent,
              target,
            );
            timer = null;
          }, THORTTLING_DELAY);
        }
      })
      .on("mouseleave", () =>
        lineGraphMouseEvent.handleMouseLeave(tooltipSelection),
      )
      .on("touchstart", () =>
        lineGraphMouseEvent.handleMouseOver(tooltipSelection),
      )
      .on("touchmove", (event: MouseEvent) => {
        if (!timer) {
          const latestEvent = event;
          const target = event.currentTarget;
          if (!target) return;
          timer = setTimeout(() => {
            lineGraphMouseEvent.handleMouseMove(
              groupedStats,
              { x_scale: scale.x, y_scale: scale.y },
              latestEvent,
              target,
            );
            timer = null;
          }, 50);
        }
      })
      .on("touchend", () =>
        lineGraphMouseEvent.handleMouseLeave(tooltipSelection),
      );

    window.addEventListener("resize", handleResize);

    return () => {
      select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase, windowSize]);

  return (
    <>
      <div className="relative">
        <div
          ref={toolTipRef}
          data-testid="tooltip"
          className="bg-bg-light border-bg-light pointer-events-none absolute z-50 w-35 touch-none rounded-sm border p-2 opacity-0"
        ></div>
        <div ref={lineGraphWrapperRef}></div>
      </div>
    </>
  );
}
