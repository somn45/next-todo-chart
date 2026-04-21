"use client";

import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";
import { BandGraph } from "@/utils/graph/band/originGraph";
import {
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  MOBILE_GRAPH_MIN_WIDTH,
  TL_GRAPH_MARGIN,
  TL_LEGEND_COLORS,
  TL_LEGEND_TEXTS,
  TL_MOBILE_GRAPH_MARGIN,
} from "@/constants/graph";
import { SerializedTodo, TodosType } from "@/types/todos/schema";
import { DataDomainBaseType } from "@/types/graph/schema";
import LegendList from "@/components/ui/molecules/LegendList";

interface TimeLineProps {
  todos: Array<TodosType & SerializedTodo>;
  dateDomainBase?: DataDomainBaseType;
}

export default function TodoTimeline({
  todos,
  dateDomainBase = "week",
}: TimeLineProps) {
  const [windowSize, setWindowSize] = useState(0);
  const bandGraphWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    if (windowSize === 0) return setWindowSize(screen.width);

    const graphContainer = bandGraphWrapperRef.current;
    if (!graphContainer) return;

    if (windowSize <= 767) {
      const graphContainerWidth =
        windowSize != 0 ? windowSize - 20 : MOBILE_GRAPH_MIN_WIDTH;

      const bandGraph = new BandGraph(
        graphContainerWidth,
        GRAPH_HEIGHT,
        TL_MOBILE_GRAPH_MARGIN,
        dateDomainBase,
        TL_LEGEND_TEXTS,
        TL_LEGEND_COLORS,
        true,
      );

      bandGraph.drowBandGraph(graphContainer, todos);
    } else {
      const bandGraph = new BandGraph(
        GRAPH_WIDTH,
        GRAPH_HEIGHT,
        TL_GRAPH_MARGIN,
        dateDomainBase,
        TL_LEGEND_TEXTS,
        TL_LEGEND_COLORS,
        false,
      );

      bandGraph.drowBandGraph(graphContainer, todos);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase, windowSize]);

  return (
    <>
      <LegendList legendTexts={TL_LEGEND_TEXTS} categoryType="circle" />
      <div ref={bandGraphWrapperRef} className="flex justify-center"></div>
    </>
  );
}
