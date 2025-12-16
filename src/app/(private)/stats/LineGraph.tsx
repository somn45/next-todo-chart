"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { createFollowMouseFocus } from "@/utils/graph";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";
import {
  displayFollowElement,
  hiddenFollowElement,
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

    const mouseover = function () {
      displayFollowElement([focus, tooltip]);
    };

    const mousemove = function () {
      const target = getDataPointClosetMousePointer(groupedStats, {
        x_scale,
        y_scale,
      });

      const dateISO8601Type = formatByISO8601(target.date);

      focus.attr("cx", x_scale(target.date)).attr("cy", target.y_pixel);
      tooltip
        .html(
          `${dateISO8601Type} 일자에서<br/> ${target.state} 상태의 총합 : ${target.count}개`,
        )
        .style("left", `${x_scale(target.date) - 25}px`)
        .style("top", `${target.y_pixel - 15}px`);
    };

    const mouseleave = function () {
      hiddenFollowElement([focus, tooltip]);
    };

    svg
      .append("rect")
      .attr("fill", "none")
      .style("pointer-events", "all")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
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
