"use client";

import { LookupedTodo, WithStringifyId } from "@/types/schema";
import useDrowBandGraph from "./_hooks/useDrowBandGraph";

interface TimeLineProps {
  todos: (LookupedTodo & WithStringifyId)[];
}

const margin = { top: 80, left: 100, bottom: 20, right: 100 };
const graphInnerWidth = 700 - margin.left - margin.right;
const graphInnerHeight = 400 - margin.top - margin.bottom;

export default function TimeLine({ todos }: TimeLineProps) {
  const [svg, scale, graphWrapperRef] = useDrowBandGraph({
    width: graphInnerWidth,
    height: graphInnerHeight,
    margin,
    data: todos,
  });

  return <div ref={graphWrapperRef}></div>;
}
