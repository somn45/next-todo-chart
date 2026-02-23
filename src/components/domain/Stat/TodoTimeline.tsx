"use client";

import * as d3 from "d3";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import { useEffect, useRef } from "react";
import { BandGraph } from "@/utils/graph/band/originGraph";

interface TimeLineProps {
  todos: (LookupedTodo & WithStringifyId)[];
  dateDomainBase?: "week" | "month" | "year";
}

const GRAPH_WIDTH = 700;
const GRAPH_HEIGHT = 400;
const GRAPH_MARGIN = { top: 80, left: 100, bottom: 20, right: 100 };

export default function TodoTimeline({
  todos,
  dateDomainBase = "week",
}: TimeLineProps) {
  const bandGraphWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const graphContainer = bandGraphWrapperRef.current;
    if (!graphContainer) return;

    const bandGraph = new BandGraph(
      GRAPH_WIDTH,
      GRAPH_HEIGHT,
      GRAPH_MARGIN,
      dateDomainBase,
      ["할 일", "진행 중", "완료"],
      ["#3498DB", "#FFA500", "#2ECC71"],
    );

    bandGraph.drowBandGraph(graphContainer, todos);

    return () => {
      d3.select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase]);

  return (
    <>
      <div ref={bandGraphWrapperRef}></div>
    </>
  );
}
