"use client";

import { LookupedTodo, WithStringifyId } from "@/types/schema";
import { useRef } from "react";
import useDrowBandGraph from "./_hooks/useDrowBandGraph";

interface TimeLineProps {
  todos: (LookupedTodo & WithStringifyId)[];
}

const margin = { top: 80, left: 100, bottom: 40, right: 20 };
const width = 660 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

export default function TimeLine({ todos }: TimeLineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [] = useDrowBandGraph({
    width,
    height,
    margin,
    data: todos,
    graphRef: timelineRef,
  });

  return <div ref={timelineRef}></div>;
}
