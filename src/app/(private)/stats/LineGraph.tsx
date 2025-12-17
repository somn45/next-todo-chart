"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { createFollowMouseFocus } from "@/utils/graph";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";
import {
  displayFollowElement,
  hiddenFollowElement,
  setCoordFocusAndToolTip,
} from "./_utils/lineGraphMouseEvent";
import useDrowLineGraph from "./_hooks/useDrowLineGraph";
import { getDataPointClosetMousePointer } from "./_utils/getDataPointClosetMousePointer";

interface LineGraphData {
  date: Date;
  state: string;
  count: number;
}

const margin = { top: 80, left: 40, bottom: 40, right: 40 };
const width = 700 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

export default function LineGraph({ stats }: { stats: LineGraphData[] }) {
  const lineGraphRef = useRef(null);
  const toolTipRef = useRef(null);

  const [svg, { x_scale, y_scale }] = useDrowLineGraph({
    width,
    height,
    margin,
    data: stats,
    graphRef: lineGraphRef,
  });

  useEffect(() => {
    if (svg === null || x_scale === null || y_scale === null) return;

    const groupedStats = d3.group(stats, d => d.state);

    const focus = createFollowMouseFocus(svg, "circle", 4);
    const tooltip = d3.select(toolTipRef.current);

    svg
      .append("rect")
      .attr("fill", "none")
      .style("pointer-events", "all")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", () => displayFollowElement([focus, tooltip]))
      .on("mousemove", () =>
        setCoordFocusAndToolTip(
          groupedStats,
          { x_scale, y_scale },
          { focus, tooltip },
        ),
      )
      .on("mouseleave", () => hiddenFollowElement([focus, tooltip]));
  }, [svg]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          ref={toolTipRef}
          style={{
            position: "absolute",
            opacity: 0,
            background: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "14px",
            zIndex: 100,
            pointerEvents: "none",
          }}
        ></div>
        <div ref={lineGraphRef}></div>
      </div>
    </>
  );
}
