"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

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
  const lineChartRef = useRef(null);
  const toolTipRef = useRef(null);

  useEffect(() => {
    const margin = { top: 60, left: 100, bottom: 40, right: 20 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const groupedStats = d3.group(stats, d => d.state);
    console.log(d3.active(lineChartRef.current));

    const tooltip = d3.select(toolTipRef.current);
    // 차트를 그릴 컨테이너 생성
    const svg = d3
      .select(lineChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("padding", "40px")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text("최근 1주간 등록된 투두 합계");

    // 스케일 작업 및 축 생성
    const x_scale = d3
      .scaleTime()
      .domain(d3.extent(stats, d => d.date) as [Date, Date])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x_scale).ticks(7));

    const y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(stats, d => d.count)] as [number, number])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y_scale));

    const focus = svg
      .append("g")
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("r", 4)
      .style("opacity", 0);

    const lineGenerator = d3
      .line<DataPoint>()
      .x(d => x_scale(d.date))
      .y(d => y_scale(d.count));

    const statsKeys = groupedStats.keys();

    const color = d3
      .scaleOrdinal<string>()
      .domain(statsKeys)
      .range(["#000000", "#3498DB", "#FFA500", "#2ECC71"]);

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
      focus.style("opacity", 1);
      tooltip.style("opacity", 1);
    };

    const mousemove = function (this: Element, event: MouseEvent) {
      const mousePointer = d3.pointer(event, this);
      const x0 = x_scale.invert(mousePointer[0]);

      const aaa = Array.from(groupedStats)[0][1];
      const dates = aaa.map(stat => stat.date);
      const i = d3.bisectCenter(dates, x0);
      const statsByArray = Array.from(groupedStats);
      const points = statsByArray.map(stats => {
        const dataPoint = stats[1][i];
        return {
          date: dataPoint.date,
          count: dataPoint.count,
          state: dataPoint.state,
          y_pixel: y_scale(dataPoint.count),
        };
      });

      const subYPixel = points.map(point =>
        Math.abs(point.y_pixel - mousePointer[1]),
      );
      const index = subYPixel.indexOf(Math.min(...subYPixel));
      const target = points[index];
      const dateFormat = `${target.date.getFullYear()}-${target.date.getMonth()}-${target.date.getDate()}`;

      focus.attr("cx", x_scale(target.date)).attr("cy", target.y_pixel);
      tooltip
        .html(
          `${dateFormat} 일자에서<br/> ${target.state} 상태의 총합 : ${target.count}개`,
        )
        .style("left", `${x_scale(target.date) - 20}px`)
        .style("top", `${target.y_pixel - 30}px`);
    };

    const mouseleave = function () {
      focus.style("opacity", 0);
      tooltip.style("opacity", 0);
    };

    svg
      .append("rect")
      .attr("fill", "none")
      .style("pointer-events", "all")
      .attr("width", width)
      .attr("height", height)
      .attr("padding-top", "30px")
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
            zIndex: 100,
            pointerEvents: "none",
          }}
        ></div>
        <div ref={lineChartRef}></div>
      </div>
    </>
  );
}
