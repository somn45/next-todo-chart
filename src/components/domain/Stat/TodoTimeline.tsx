"use client";

import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import { BandGraph } from "@/utils/graph/band/originGraph";
import {
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  TL_GRAPH_MARGIN,
  TL_LEGEND_COLORS,
  TL_LEGEND_TEXTS,
} from "@/constants/graph";
import { SerializedTodo, TodosType } from "@/types/todos/schema";
import { DataDomainBaseType } from "@/types/graph/schema";

interface TimeLineProps {
  todos: Array<TodosType & SerializedTodo>;
  dateDomainBase?: DataDomainBaseType;
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
      select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase]);

  return (
    <>
      <div ref={bandGraphWrapperRef}></div>
    </>
  );
}
