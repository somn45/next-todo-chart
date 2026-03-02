"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { BandSparkline } from "@/utils/graph/band/sparkline";
import {
  SPARKLINE_HEIGHT,
  SPARKLINE_WIDTH,
  TL_GRAPH_MARGIN,
  TL_LEGEND_COLORS,
  TL_LEGEND_TEXTS,
} from "@/constants/graph";
import { SerializedTodo, TodosType } from "@/types/todos/schema";
import { DataDomainBaseType } from "@/types/graph/schema";

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
    const container = bandSparklineRef.current;
    if (!container) return;

    const bandSparkline = new BandSparkline(
      SPARKLINE_WIDTH,
      SPARKLINE_HEIGHT,
      TL_GRAPH_MARGIN,
      dateDomainBase,
      TL_LEGEND_TEXTS,
      TL_LEGEND_COLORS,
    );

    bandSparkline.drowBandSparkline(container, todos);

    return () => {
      d3.select(container).selectAll("*").remove();
    };
  }, []);

  return (
    <>
      <div ref={bandSparklineRef}></div>
    </>
  );
}
