"use client";

import * as d3 from "d3";
import { ILineGraphData } from "@/types/schema";
import { useEffect, useRef } from "react";
import { caculateTickCount } from "@/utils/graph/caculateTickCount";
import { LineSparkline } from "@/utils/graph/line/sparkline";

interface LineGraphSparklineProps {
  stats: ILineGraphData[];
  dateDomainBase?: "week" | "month" | "year";
}

interface DataPoint {
  date: Date;
  count: number;
}

const GRAPH_WIDTH = 400;
const GRAPH_HEIGHT = 300;

export default function LineGraphSparkline({
  stats,
  dateDomainBase = "week",
}: LineGraphSparklineProps) {
  const lineSparklineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = lineSparklineRef.current;
    if (!container) return;

    const graphMargin = { top: 80, left: 30, bottom: 20, right: 100 };
    const lineSparkline = new LineSparkline(
      GRAPH_WIDTH,
      GRAPH_HEIGHT,
      graphMargin,
      dateDomainBase,
      ["총합", "할 일", "진행 중", "완료"],
      ["#000000", "#3498DB", "#FFA500", "#2ECC71"],
    );

    lineSparkline.drowLineSparkline(container, stats);

    return () => {
      d3.select(container).selectAll("*").remove();
    };
  }, []);

  return <div ref={lineSparklineRef}></div>;
}
