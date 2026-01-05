"use client";

import { ILineGraphData } from "@/types/schema";
import useDrowLineGraphSparkline from "../../hooks/useDrowLineGraphSparkline";

interface LineGraphSparklineProps {
  stats: ILineGraphData[];
  dateDomainBase?: "week" | "month" | "year";
}

const GRAPH_WIDTH = 400;
const GRAPH_HEIGHT = 300;

export default function LineGraphSparkline({
  stats,
  dateDomainBase = "week",
}: LineGraphSparklineProps) {
  const [, , lineGraphSparklineRef] = useDrowLineGraphSparkline({
    outerWidth: GRAPH_WIDTH,
    outerHeight: GRAPH_HEIGHT,
    data: stats,
    dateDomainBase,
  });
  return <div ref={lineGraphSparklineRef}></div>;
}
