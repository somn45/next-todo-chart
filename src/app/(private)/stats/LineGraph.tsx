"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { createFollowMouseFocus } from "@/utils/graph";
import {
  displayFollowElement,
  hiddenFollowElement,
  setCoordFocusAndToolTip,
} from "./_utils/lineGraphMouseEvent";
import useDrowLineGraph from "./_hooks/useDrowLineGraph";

interface LineGraphData {
  date: Date;
  state: string;
  count: number;
}

const margin = { top: 80, left: 30, bottom: 20, right: 100 };
const graphInnerWidth = 700 - margin.left - margin.right;
const graphInnerHeight = 400 - margin.top - margin.bottom;

export default function LineGraph({ stats }: { stats: LineGraphData[] }) {
  const toolTipRef = useRef<HTMLDivElement | null>(null);

  const [svg, { x_scale, y_scale }, lineGraphWrapperRef] = useDrowLineGraph({
    width: graphInnerWidth,
    height: graphInnerHeight,
    margin,
    data: stats,
  });

  useEffect(() => {
    if (svg === null || x_scale === null || y_scale === null) return;

    const groupedStats = d3.group(stats, d => d.state);

    const focus = createFollowMouseFocus(svg, "circle", 4);
    const tooltip = d3.select(toolTipRef.current) as d3.Selection<
      HTMLDivElement,
      unknown,
      null,
      undefined
    >;

    svg
      .append("rect")
      .attr("fill", "none")
      .style("pointer-events", "all")
      .attr("width", graphInnerHeight)
      .attr("height", graphInnerHeight)
      .on("mouseover", () => displayFollowElement([focus, tooltip]))
      .on("mousemove", (event: MouseEvent) =>
        setCoordFocusAndToolTip(
          groupedStats,
          { x_scale, y_scale },
          { focus, tooltip },
          event,
        ),
      )
      .on("mouseleave", () => hiddenFollowElement([focus, tooltip]));
  }, [svg]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          ref={toolTipRef}
          className="tooltip"
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
        <div ref={lineGraphWrapperRef}></div>
      </div>
    </>
  );
}
