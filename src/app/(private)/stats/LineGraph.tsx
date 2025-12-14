"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  addTitle,
  createColorScale,
  createFollowMouseFocus,
  createLegend,
  createLinearScale,
  createSVGContainer,
  createTimeScale,
  setLegendItems,
  setXAxis,
  setYAxis,
} from "@/utils/graph/graph";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";
import {
  displayFollowElement,
  hiddenFollowElement,
} from "./_utils/lineGraphMouseEvent";
import { getClosestYOffset } from "./_utils/getClosestYOffset";

interface DataPoint {
  date: Date;
  count: number;
}

interface LineGraphData {
  date: Date;
  state: string;
  count: number;
}

export default function LineGraph({ stats }: { stats: LineGraphData[] }) {
  const lineChartRef = useRef<HTMLDivElement>(null);
  const toolTipRef = useRef(null);

  useEffect(() => {
    if (lineChartRef.current!.hasChildNodes()) return;
    const margin = { top: 80, left: 40, bottom: 40, right: 40 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const groupedStats = d3.group(stats, d => d.state);

    const tooltip = d3.select(toolTipRef.current);
    // 그래프를 그릴 컨테이너 생성
    const svg = createSVGContainer(
      { width, height, margin },
      lineChartRef.current,
    );

    addTitle(svg, width / 2, -50, "최근 1주간 등록된 투두 합계");

    const legend = createLegend(svg, width - 50);

    const legendMarkerSize = { width: 15, height: 2 };
    const legendInitCoord = { x: 0, y: 0, textX: 22, textY: 6 };
    const legendColors = ["black", "#3498DB", "#FFA500", "#2ECC71"];
    const legendTexts = ["투두 총합", "할 일", "진행 중", "완료"];

    setLegendItems(
      "rect",
      legend,
      legendMarkerSize,
      legendInitCoord,
      legendColors,
      legendTexts,
    );

    const x_scale = createTimeScale(stats, width - 80);
    setXAxis(svg, x_scale, 7, height);

    const y_scale = createLinearScale(stats, height);
    setYAxis(svg, y_scale);

    const focus = createFollowMouseFocus(svg, "circle", 4);

    const lineGenerator = d3
      .line<DataPoint>()
      .x(d => x_scale(d.date))
      .y(d => y_scale(d.count));

    const statsKeys = groupedStats.keys();

    const color = createColorScale(statsKeys, [
      "#000000",
      "#3498DB",
      "#FFA500",
      "#2ECC71",
    ]);

    svg
      .selectAll(".line")
      .data(groupedStats.entries())
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 2.5)
      .attr("d", d => lineGenerator(d[1]));

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
  }, []);

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
        <div ref={lineChartRef}></div>
      </div>
    </>
  );
}
