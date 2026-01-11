"use client";

import useDrowBandGraph from "@/app/(private)/stats/_hooks/useDrowBandGraph";
import { LookupedTodo, WithStringifyId } from "@/types/schema";

interface TimeLineProps {
  todos: (LookupedTodo & WithStringifyId)[];
  dateDomainBase?: "week" | "month" | "year";
}

const GRAPH_WIDTH = 700;
const GRAPH_HEIGHT = 400;

export default function TodoTimeline({
  todos,
  dateDomainBase = "week",
}: TimeLineProps) {
  const [, , graphWrapperRef] = useDrowBandGraph({
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
