"use client";

import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import { LineSparkline } from "@/utils/graph/line/sparkline";
import {
  DAT_GRAPH_MARGIN,
  DAT_LEGEND_COLORS,
  DAT_LEGEND_TEXTS,
  DAT_MOBILE_GRAPH_MARGIN,
  SPARKLINE_HEIGHT,
} from "@/constants/graph";
import { DataDomainBaseType } from "@/types/graph/schema";
import { TodoStat } from "@/types/stats/schema";
import { MOBILE_LARGE_SIZE } from "@/constants/media";

interface LineGraphSparklineProps {
  stats: TodoStat[];
  dateDomainBase?: DataDomainBaseType;
}

export default function LineGraphSparkline({
  stats,
  dateDomainBase = "week",
}: LineGraphSparklineProps) {
  const lineSparklineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const graphContainer = lineSparklineRef.current;
    if (!graphContainer) return;

    const graphWidth = graphContainer.getBoundingClientRect().width;

    let lineSparkline: LineSparkline;
    const isMobileSize = window.innerWidth + 20 <= MOBILE_LARGE_SIZE;

    const sparklineContainerMargin = isMobileSize
      ? DAT_MOBILE_GRAPH_MARGIN
      : DAT_GRAPH_MARGIN;

    if (isMobileSize) {
      const graphOptions = {
        width: graphWidth,
        height: SPARKLINE_HEIGHT,
        margin: sparklineContainerMargin,
        dateDomainBase,
        texts: DAT_LEGEND_TEXTS,
        colors: DAT_LEGEND_COLORS,
      };
      lineSparkline = new LineSparkline(graphOptions, stats);
    } else {
      const graphOptions = {
        width: graphWidth,
        height: SPARKLINE_HEIGHT,
        margin: sparklineContainerMargin,
        dateDomainBase,
        texts: DAT_LEGEND_TEXTS,
        colors: DAT_LEGEND_COLORS,
      };
      lineSparkline = new LineSparkline(graphOptions, stats);
    }

    lineSparkline.drowLineSparkline(graphContainer, stats);

    const handleResize = () => {
      if (!lineSparklineRef.current) return;
      const resizedWidth =
        lineSparklineRef.current.getBoundingClientRect().width;
      lineSparkline.resizeSparklineWidth(resizedWidth, window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      select(graphContainer).selectAll("*").remove();
    };
  }, []);

  return (
    <div
      ref={lineSparklineRef}
      className="h-75 w-[calc(100vw-20px)] min-[425px]:w-100"
    ></div>
  );
}
