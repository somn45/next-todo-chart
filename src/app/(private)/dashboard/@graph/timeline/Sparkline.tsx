"use client";

import * as d3 from "d3";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import { useEffect, useRef } from "react";
import { BandSparkline } from "@/utils/graph/band/sparkline";

interface TimelineSparklineProps {
  todos: (LookupedTodo & WithStringifyId)[];
  dateDomainBase?: "week" | "month" | "year";
}

const GRAPH_WIDTH = 400;
const GRAPH_HEIGHT = 300;

export default function TimeLineSparkline({
  todos,
  dateDomainBase = "week",
}: TimelineSparklineProps) {
  const bandSparklineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = bandSparklineRef.current;
    if (!container) return;

    const graphMargin = { top: 80, left: 100, bottom: 20, right: 100 };

    const bandSparkline = new BandSparkline(
      GRAPH_WIDTH,
      GRAPH_HEIGHT,
      graphMargin,
      dateDomainBase,
      ["할 일", "진행 중", "완료"],
      ["#3498DB", "#FFA500", "#2ECC71"],
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
