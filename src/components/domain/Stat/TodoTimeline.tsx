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
import { MAX_MOBILE_SIZE } from "@/constants/media";

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

    const isMounted = windowSize !== 0;
    if (!isMounted) return setWindowSize(screen.width);

    const graphContainer = bandGraphWrapperRef.current;
    if (!graphContainer) return;

    const isMobileSize = windowSize <= MAX_MOBILE_SIZE;
    const graphContainerMargin = isMobileSize
      ? TL_MOBILE_GRAPH_MARGIN
      : TL_GRAPH_MARGIN;

    if (windowSize <= 767) {
      const graphContainerWidth = isMounted
        ? windowSize - 20
        : MOBILE_GRAPH_MIN_WIDTH;

      const graphOptions = {
        width: graphContainerWidth,
        height: GRAPH_HEIGHT,
        margin: graphContainerMargin,
        dateDomainBase,
        texts: TL_LEGEND_TEXTS,
        colors: TL_LEGEND_COLORS,
        isMobileSize: true,
      };

      const bandGraph = new BandGraph(graphOptions, todos);

      bandGraph.drowBandGraph(graphContainer);
    } else {
      const graphOptions = {
        width: GRAPH_WIDTH,
        height: GRAPH_HEIGHT,
        margin: graphContainerMargin,
        dateDomainBase,
        texts: TL_LEGEND_TEXTS,
        colors: TL_LEGEND_COLORS,
        isMobileSize: false,
      };

      const bandGraph = new BandGraph(graphOptions, todos);

      bandGraph.drowBandGraph(graphContainer);
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
