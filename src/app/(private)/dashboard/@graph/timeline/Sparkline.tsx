"use client";

import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import { BandSparkline } from "@/utils/graph/band/sparkline";
import {
  SPARKLINE_HEIGHT,
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

  useEffect(() => {
    const graphContainer = bandSparklineRef.current;
    if (!graphContainer) return;

    const graphWidth = graphContainer.getBoundingClientRect().width;

    let bandSparkline: BandSparkline;
    const isMobileSize = window.innerWidth + 20 <= MOBILE_LARGE_SIZE;

    if (isMobileSize) {
      const graphOption = {
        width: graphWidth,
        height: SPARKLINE_HEIGHT,
        margin: TL_MOBILE_GRAPH_MARGIN,
        dateDomainBase,
        texts: TL_LEGEND_TEXTS,
        colors: TL_LEGEND_COLORS,
      };
      bandSparkline = new BandSparkline(graphOption, todos);
    } else {
      const graphOption = {
        width: graphWidth,
        height: SPARKLINE_HEIGHT,
        margin: TL_MOBILE_GRAPH_MARGIN,
        dateDomainBase,
        texts: TL_LEGEND_TEXTS,
        colors: TL_LEGEND_COLORS,
      };
      bandSparkline = new BandSparkline(graphOption, todos);
    }

    bandSparkline.drowBandSparkline(graphContainer, todos);

    const handleResize = () => {
      if (!bandSparklineRef.current) return;
      const resizedWidth =
        bandSparklineRef.current.getBoundingClientRect().width;
      bandSparkline.resizeSparklineWidth(resizedWidth, window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      select(graphContainer).selectAll("*").remove();
    };
  }, []);

  return (
    <>
      <div
        ref={bandSparklineRef}
        className="h-75 w-[calc(100vw-20px)] min-[425px]:w-100"
      ></div>
    </>
  );
}
