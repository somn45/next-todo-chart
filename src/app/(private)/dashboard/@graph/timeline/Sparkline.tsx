"use client";

import { LookupedTodo, WithStringifyId } from "@/types/schema";
import useDrowTimelineSparkline from "../../hooks/useDrowTimelineSparkline";

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
  const [, , timelineSparklineRef] = useDrowTimelineSparkline({
    outerWidth: GRAPH_WIDTH,
    outerHeight: GRAPH_HEIGHT,
    data: todos,
    dateDomainBase,
  });
  return (
    <>
      <div ref={timelineSparklineRef}></div>
    </>
  );
}
