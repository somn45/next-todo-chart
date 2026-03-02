"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { LineSparkline } from "@/utils/graph/line/sparkline";
import {
  DAT_GRAPH_MARGIN,
  DAT_LEGEND_COLORS,
  DAT_LEGEND_TEXTS,
  SPARKLINE_HEIGHT,
  SPARKLINE_WIDTH,
} from "@/constants/graph";
import { DataDomainBaseType } from "@/types/graph/schema";
import { TodoStat } from "@/types/stats/schema";

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
    const container = lineSparklineRef.current;
    if (!container) return;

    const lineSparkline = new LineSparkline(
      SPARKLINE_WIDTH,
      SPARKLINE_HEIGHT,
      DAT_GRAPH_MARGIN,
      dateDomainBase,
      DAT_LEGEND_TEXTS,
      DAT_LEGEND_COLORS,
    );

    lineSparkline.drowLineSparkline(container, stats);

    return () => {
      d3.select(container).selectAll("*").remove();
    };
  }, []);

  return <div ref={lineSparklineRef}></div>;
}
