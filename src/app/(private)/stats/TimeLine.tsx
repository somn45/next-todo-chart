"use client";

import { LookupedTodo, WithStringifyId } from "@/types/schema";
import useDrowBandGraph from "./_hooks/useDrowBandGraph";
import Link from "next/link";

interface TimeLineProps {
  todos: (LookupedTodo & WithStringifyId)[];
}

const GRAPH_WIDTH = 700;
const GRAPH_HEIGHT = 400;

export default function TimeLine({ todos }: TimeLineProps) {
  const [svg, scale, graphWrapperRef] = useDrowBandGraph({
    outerWidth: GRAPH_WIDTH,
    outerHeight: GRAPH_HEIGHT,
    data: todos,
  });

  return (
    <>
      <div ref={graphWrapperRef}></div>
    </>
  );
}
