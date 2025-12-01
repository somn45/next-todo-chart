"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  date: Date;
  value: number;
}

const data = [
  { date: new Date(2025, 0, 1), value: 632, state: 1 },
  { date: new Date(2025, 0, 1), value: 7591, state: 2 },
  { date: new Date(2025, 0, 1), value: 1024, state: 3 },
  { date: new Date(2025, 0, 2), value: 5978, state: 1 },
  { date: new Date(2025, 0, 2), value: 569, state: 2 },
  { date: new Date(2025, 0, 2), value: 2194, state: 3 },
  { date: new Date(2025, 0, 3), value: 4294, state: 1 },
  { date: new Date(2025, 0, 3), value: 898, state: 2 },
  { date: new Date(2025, 0, 3), value: 1492, state: 3 },
  { date: new Date(2025, 0, 4), value: 3075, state: 1 },
  { date: new Date(2025, 0, 4), value: 7817, state: 2 },
  { date: new Date(2025, 0, 4), value: 5072, state: 3 },
  { date: new Date(2025, 0, 5), value: 440, state: 1 },
  { date: new Date(2025, 0, 5), value: 6191, state: 2 },
  { date: new Date(2025, 0, 5), value: 3788, state: 3 },
];

export default function FakeLineGraph() {
  const fakelineChartRef = useRef(null);

  useEffect(() => {
    const groupedData = d3.group(data, d => String(d.state));

    // 차트를 그릴 컨테이너 생성
    const fakeSvg = d3
      .select(fakelineChartRef.current)
      .append("svg")
      .attr("width", 500)
      .attr("height", 400)
      .append("g")
      .attr("class", "fake-line-graph")
      .attr("transform", `translate(40, 10)`);

    // 스케일 작업 및 축 생성
    const x_scale = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, 450]);
    fakeSvg
      .append("g")
      .attr("transform", "translate(0, 340)")
      .call(d3.axisBottom(x_scale).ticks(5));

    const y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value)] as [number, number])
      .range([340, 0]);
    fakeSvg.append("g").call(d3.axisLeft(y_scale));

    const lineGenerator = d3
      .line<DataPoint>()
      .x(d => x_scale(d.date))
      .y(d => y_scale(d.value));

    const keys = groupedData.keys();

    const color = d3
      .scaleOrdinal<string>()
      .domain(keys)
      .range(["#e41a1c", "#377eb8", "#4daf4a"]);

    fakeSvg
      .selectAll(".line")
      .data(groupedData.entries())
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 2.5)
      .attr("d", d => lineGenerator(d[1]));
  }, []);

  return <div ref={fakelineChartRef}></div>;
}
