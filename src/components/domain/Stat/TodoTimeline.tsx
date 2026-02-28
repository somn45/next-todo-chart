"use client";

import * as d3 from "d3";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import { useEffect, useRef } from "react";
import { BandGraph } from "@/utils/graph/band/originGraph";
import {
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  TL_GRAPH_MARGIN,
  TL_LEGEND_COLORS,
  TL_LEGEND_TEXTS,
} from "@/constants/graph";

interface TimeLineProps {
  todos: (LookupedTodo & WithStringifyId)[];
  dateDomainBase?: "week" | "month" | "year";
}

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
      TL_GRAPH_MARGIN,
      dateDomainBase,
      TL_LEGEND_TEXTS,
      TL_LEGEND_COLORS,
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
