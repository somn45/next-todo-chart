"use client";

import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";
import { BandSparkline } from "@/utils/graph/band/sparkline";
import {
  MOBILE_GRAPH_MIN_WIDTH,
  SPARKLINE_HEIGHT,
  SPARKLINE_WIDTH,
  TL_GRAPH_MARGIN,
  TL_LEGEND_COLORS,
  TL_LEGEND_TEXTS,
  TL_MOBILE_GRAPH_MARGIN,
} from "@/constants/graph";
import { SerializedTodo, TodosType } from "@/types/todos/schema";
import { DataDomainBaseType } from "@/types/graph/schema";
import { MOBILE_LARGE_SIZE } from "@/constants/media";

interface TimelineSparklineProps {
  todos: Array<TodosType & SerializedTodo>;
  dateDomainBase?: DataDomainBaseType;
}

export default function TimeLineSparkline({
  todos,
  dateDomainBase = "week",
}: TimelineSparklineProps) {
  const bandSparklineRef = useRef<HTMLDivElement | null>(null);

  const [windowSize, setWindowSize] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    const isMounted = windowSize !== 0;
    if (!isMounted) setWindowSize(window.innerWidth);

    const container = bandSparklineRef.current;
    if (!container) return;

    let bandSparkline: BandSparkline;
    const isMobileSize = windowSize <= MOBILE_LARGE_SIZE;
    let sparklineContainerWidth = SPARKLINE_WIDTH;

    const sparklineContainerMargin = isMobileSize
      ? TL_MOBILE_GRAPH_MARGIN
      : TL_GRAPH_MARGIN;

    if (isMobileSize) {
      sparklineContainerWidth = isMounted
        ? windowSize - 20
        : MOBILE_GRAPH_MIN_WIDTH;

      bandSparkline = new BandSparkline(
        sparklineContainerWidth,
        SPARKLINE_HEIGHT,
        sparklineContainerMargin,
        dateDomainBase,
        TL_LEGEND_TEXTS,
        TL_LEGEND_COLORS,
      );
    } else {
      bandSparkline = new BandSparkline(
        sparklineContainerWidth,
        SPARKLINE_HEIGHT,
        sparklineContainerMargin,
        dateDomainBase,
        TL_LEGEND_TEXTS,
        TL_LEGEND_COLORS,
      );
    }

    bandSparkline.drowBandSparkline(container, todos);

    window.addEventListener("resize", handleResize);
    return () => {
      select(container).selectAll("*").remove();
    };
  }, [windowSize]);

  return (
    <>
      <div ref={bandSparklineRef}></div>
    </>
  );
}
