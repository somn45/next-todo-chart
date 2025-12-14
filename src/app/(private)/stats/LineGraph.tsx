"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { createFollowMouseFocus } from "@/utils/graph/graph";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";
import {
  displayFollowElement,
  hiddenFollowElement,
} from "./_utils/lineGraphMouseEvent";
import { getClosestYOffset } from "./_utils/getClosestYOffset";
import useDrowLineGraph from "./_hooks/useDrowLineGraph";

interface DataPoint {
  date: Date;
  count: number;
}

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

    const mousemove = function (this: Element, event: MouseEvent) {
      // 마우스가 가리키는 좌표 구하기([x, y])
      const [mouseXCoord, mouseYCoord] = d3.pointer(event, this);

      const dateMatchedMouseXCoord = x_scale.invert(mouseXCoord);

      const stats = Array.from(groupedStats)[0][1];
      const xAxisKeys = stats.map(stat => stat.date);

      // 마우스 포인터의 x 축과 가장 가까운 x축 키 찾기
      const xAxisKeyClosestMouseXCoord = d3.bisectCenter(
        xAxisKeys,
        dateMatchedMouseXCoord,
      );

      const statsByArray = Array.from(groupedStats);

      // bisect 메서드를 통해 마우스 포인터와 가장 가까운 데이터와 y축 좌표를 구한다.
      const dataPoints = statsByArray.map(stats => {
        const dataPoint = stats[1][xAxisKeyClosestMouseXCoord];
        return {
          date: dataPoint.date,
          count: dataPoint.count,
          state: dataPoint.state,
          y_pixel: y_scale(dataPoint.count),
        };
      });

      const target = getClosestYOffset(dataPoints, mouseYCoord);

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
