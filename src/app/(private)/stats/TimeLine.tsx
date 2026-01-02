"use client";

import { LookupedTodo, WithStringifyId } from "@/types/schema";
import useDrowBandGraph from "./_hooks/useDrowBandGraph";

interface TimeLineProps {
  todos: (LookupedTodo & WithStringifyId)[];
  dateDomainBase?: "week" | "month" | "year";
}

const GRAPH_WIDTH = 700;
const GRAPH_HEIGHT = 400;

export default function TimeLine({
  todos,
  dateDomainBase = "week",
}: TimeLineProps) {
  const [svg, scale, graphWrapperRef] = useDrowBandGraph({
    outerWidth: GRAPH_WIDTH,
    outerHeight: GRAPH_HEIGHT,
    data: todos,
    dateDomainBase,
  });

  return (
    <>
      <div ref={graphWrapperRef}></div>
    </>
  );
}
