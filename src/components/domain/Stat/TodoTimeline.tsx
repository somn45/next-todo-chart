"use client";

import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import { BandGraph } from "@/utils/graph/band/originGraph";
import {
  GRAPH_HEIGHT,
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
  const bandGraphWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const graphContainer = bandGraphWrapperRef.current;
    if (!graphContainer) return;

    const graphWidth = graphContainer.getBoundingClientRect().width;

    const isMobileSize = graphWidth + 20 <= MAX_MOBILE_SIZE;
    const graphContainerMargin = isMobileSize
      ? TL_MOBILE_GRAPH_MARGIN
      : TL_GRAPH_MARGIN;

    let bandGraph: BandGraph;

    if (isMobileSize) {
      const graphOptions = {
        width: graphWidth,
        height: GRAPH_HEIGHT,
        margin: graphContainerMargin,
        dateDomainBase,
        texts: TL_LEGEND_TEXTS,
        colors: TL_LEGEND_COLORS,
        isMobile: true,
      };

      bandGraph = new BandGraph(graphOptions, todos);

      bandGraph.drowBandGraph(graphContainer);
    } else {
      const graphOptions = {
        width: graphWidth,
        height: GRAPH_HEIGHT,
        margin: graphContainerMargin,
        dateDomainBase,
        texts: TL_LEGEND_TEXTS,
        colors: TL_LEGEND_COLORS,
        isMobile: false,
      };

      bandGraph = new BandGraph(graphOptions, todos);

      bandGraph.drowBandGraph(graphContainer);
    }

    const handleResize = () => {
      if (!bandGraphWrapperRef.current) return;
      const resizedWidth =
        bandGraphWrapperRef.current.getBoundingClientRect().width;
      bandGraph.resizeGraphWidth(resizedWidth, window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase]);

  return (
    <>
      <LegendList legendTexts={TL_LEGEND_TEXTS} categoryType="circle" />
      <div
        ref={bandGraphWrapperRef}
        className="h-100 w-[calc(100vw-20px)] md:w-175"
      ></div>
    </>
  );
}
