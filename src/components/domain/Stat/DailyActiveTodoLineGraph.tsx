"use client";

import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import { LineGraph } from "@/utils/graph/line/originGraph";
import { LineGraphMouseEvent } from "@/utils/graph/line/event";
import { DateDomainBaseType } from "@/types/graph/schema";
import { TodoStat } from "@/types/stats/schema";
import {
  DAT_GRAPH_MARGIN,
  DAT_LEGEND_COLORS,
  DAT_LEGEND_TEXTS,
  DAT_MOBILE_GRAPH_MARGIN,
  GRAPH_HEIGHT,
} from "@/constants/graph";
import { MAX_MOBILE_SIZE } from "@/constants/media";
import LegendList from "@/components/ui/molecules/LegendList";

export default function DailyActiveTodoLineGraph({
  stats,
  dateDomainBase = "week",
}: {
  stats: TodoStat[];
  dateDomainBase?: DateDomainBaseType;
}) {
  const lineGraphWrapperRef = useRef<HTMLDivElement | null>(null);
  const toolTipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const graphContainer = lineGraphWrapperRef.current;
    if (!graphContainer) return;

    const graphWidth = graphContainer.getBoundingClientRect().width;

    let lineGraph: LineGraph;
    const isMobileSize = window.innerWidth + 20 <= MAX_MOBILE_SIZE;

    const graphContainerMargin = isMobileSize
      ? DAT_MOBILE_GRAPH_MARGIN
      : DAT_GRAPH_MARGIN;

    if (isMobileSize) {
      const graphOptions = {
        width: graphWidth,
        height: GRAPH_HEIGHT,
        margin: graphContainerMargin,
        dateDomainBase,
        texts: DAT_LEGEND_TEXTS,
        colors: DAT_LEGEND_COLORS,
        isMobile: true,
      };

      lineGraph = new LineGraph(graphOptions, stats);
    } else {
      const graphOptions = {
        width: graphWidth,
        height: GRAPH_HEIGHT,
        margin: graphContainerMargin,
        dateDomainBase,
        texts: DAT_LEGEND_TEXTS,
        colors: DAT_LEGEND_COLORS,
        isMobile: false,
      };

      lineGraph = new LineGraph(graphOptions, stats);
    }

    const scale = lineGraph.drowLineGraph(graphContainer, stats);
    if (!scale) return;
    const graphGroup = lineGraph.graphGroup;
    if (!toolTipRef.current) return;

    const lineGraphMouseEvent = new LineGraphMouseEvent(
      {
        width: graphWidth,
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

    const handleResize = () => {
      if (!lineGraphWrapperRef.current) return;
      const resizedWidth =
        lineGraphWrapperRef.current.getBoundingClientRect().width;
      lineGraph.resizeGraphWidth(resizedWidth, window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase]);

  return (
    <>
      <LegendList legendTexts={DAT_LEGEND_TEXTS} categoryType="rect" />
      <div className="relative">
        <div
          ref={toolTipRef}
          data-testid="tooltip"
          className="bg-bg-light border-bg-light pointer-events-none absolute z-50 w-35 touch-none rounded-sm border p-2 opacity-0"
        ></div>
        <div
          ref={lineGraphWrapperRef}
          className="h-100 w-[calc(100vw-20px)] md:w-175"
        ></div>
      </div>
    </>
  );
}
