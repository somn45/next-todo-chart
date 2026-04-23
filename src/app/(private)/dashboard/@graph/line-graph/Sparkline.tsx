"use client";

import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";
import { LineSparkline } from "@/utils/graph/line/sparkline";
import {
  DAT_GRAPH_MARGIN,
  DAT_LEGEND_COLORS,
  DAT_LEGEND_TEXTS,
  DAT_MOBILE_GRAPH_MARGIN,
  MOBILE_GRAPH_MIN_WIDTH,
  SPARKLINE_HEIGHT,
  SPARKLINE_WIDTH,
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

  const [windowSize, setWindowSize] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    const isMounted = windowSize !== 0;
    if (!isMounted) setWindowSize(window.innerWidth);

    const container = lineSparklineRef.current;
    if (!container) return;

    let lineSparkline: LineSparkline;
    const isMobileSize = windowSize <= MOBILE_LARGE_SIZE;
    let sparklineContainerWidth = SPARKLINE_WIDTH;
    const sparklineContainerMargin = isMobileSize
      ? DAT_MOBILE_GRAPH_MARGIN
      : DAT_GRAPH_MARGIN;

    if (isMobileSize) {
      sparklineContainerWidth = isMounted
        ? windowSize - 20
        : MOBILE_GRAPH_MIN_WIDTH;

      lineSparkline = new LineSparkline(
        sparklineContainerWidth,
        SPARKLINE_HEIGHT,
        sparklineContainerMargin,
        dateDomainBase,
        DAT_LEGEND_TEXTS,
        DAT_LEGEND_COLORS,
      );
    } else {
      lineSparkline = new LineSparkline(
        sparklineContainerWidth,
        SPARKLINE_HEIGHT,
        sparklineContainerMargin,
        dateDomainBase,
        DAT_LEGEND_TEXTS,
        DAT_LEGEND_COLORS,
      );
    }

    lineSparkline.drowLineSparkline(container, stats);

    window.addEventListener("resize", handleResize);
    return () => {
      select(container).selectAll("*").remove();
    };
  }, [windowSize]);

  return <div ref={lineSparklineRef}></div>;
}
