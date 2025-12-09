"use client";

import { LookupedTodo, WithStringifyId } from "@/types/schema";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface TimeLineProps {
  todos: (LookupedTodo & WithStringifyId)[];
}

export default function TimeLine({ todos }: TimeLineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (timelineRef.current!.hasChildNodes()) return;

    const margin = { top: 80, left: 100, bottom: 40, right: 20 };
    const width = 660 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(timelineRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 그래프 타이틀 추가
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text("금주 투두 진행 타임라인");

    // 범례 추가
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 50}, 0)`);

    legend
      .append("circle")
      .attr("r", 5)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", "#3498DB");
    legend
      .append("text")
      .attr("font-size", "12px")
      .attr("x", 12)
      .attr("y", 4)
      .text("할 일");

    legend
      .append("circle")
      .attr("r", 5)
      .attr("cx", 0)
      .attr("cy", 25)
      .attr("fill", "#FFA500");
    legend
      .append("text")
      .attr("font-size", "12px")
      .attr("x", 12)
      .attr("y", 29)
      .text("진행 중");

    legend
      .append("circle")
      .attr("r", 5)
      .attr("cx", 0)
      .attr("cy", 50)
      .attr("fill", "#2ECC71");
    legend
      .append("text")
      .attr("font-size", "12px")
      .attr("x", 12)
      .attr("y", 54)
      .text("완료");

    // 17 / 2 = 8.5 - 5

    const currentDay = new Date().getDay();
    const currentWeekArray = Array.from(
      { length: 7 },
      (_, i) => i - currentDay,
    );
    const currentWeek = currentWeekArray.map(ele => {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      return new Date(Date.now() + ONE_DAY * ele);
    });

    const currentWeekFirstDay = new Date(
      currentWeek[0].getFullYear(),
      currentWeek[0].getMonth(),
      currentWeek[0].getDate(),
      0,
      0,
    );

    const currentWeekLastDay = new Date(
      currentWeek[currentWeek.length - 1].getFullYear(),
      currentWeek[currentWeek.length - 1].getMonth(),
      currentWeek[currentWeek.length - 1].getDate(),
      23,
      59,
    );

    const x_scale = d3
      .scaleTime()
      .domain([currentWeekFirstDay, currentWeekLastDay])
      .range([0, width - 80]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x_scale)
          .ticks(8)
          .tickFormat((d, _) => {
            if (typeof d === "object") {
              const xAxisDate = new Date(d.toString()).getDate();
              const padDate = xAxisDate < 10 ? `0${xAxisDate}` : xAxisDate;
              const todayPadDate =
                new Date().getDate() < 10
                  ? `0${new Date().getDate()}`
                  : new Date().getDate();
              const todayFormat = `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${todayPadDate}`;

              const dateFormat = `${new Date(d.toString()).getFullYear()}-${
                new Date(d.toString()).getMonth() + 1
              }-${padDate}`;

              return todayFormat === dateFormat
                ? `${dateFormat}(오늘)`
                : dateFormat;
            }
            return d.toString();
          }),
      );

    const y_scale = d3
      .scaleBand()
      .domain(todos.map(todo => todo.content.textField))
      .range([0, height])
      .padding(0.2);
    svg.append("g").call(d3.axisLeft(y_scale));

    const color_scale = d3
      .scaleOrdinal<string>()
      .domain(["할 일", "진행 중", "완료"])
      .range(["#3498DB", "#FFA500", "#2ECC71"]);

    svg
      .selectAll("rect")
      .data(todos)
      .join("rect")
      .attr("fill", d => color_scale(d.content.state))
      .attr("x", d => {
        if (
          currentWeekFirstDay.getTime() >
          new Date(d.content.createdAt).getTime()
        ) {
          return x_scale(currentWeekFirstDay);
        }
        return x_scale(new Date(d.content.createdAt));
      })
      .attr("y", d => y_scale(d.content.textField)!)
      .attr("width", d => {
        let bbb;
        if (!d.content.completedAt) {
          bbb = x_scale(new Date(Date.now()));
        } else if (
          currentWeekLastDay.getTime() <
          new Date(d.content.completedAt).getTime()
        ) {
          bbb = x_scale(currentWeekLastDay);
        } else {
          bbb = x_scale(new Date(d.content.completedAt));
        }
        let aaa;
        if (
          currentWeekFirstDay.getTime() >
          new Date(d.content.createdAt).getTime()
        ) {
          aaa = x_scale(currentWeekFirstDay);
        } else {
          aaa = x_scale(new Date(d.content.createdAt));
        }
        return bbb - aaa;
      })
      .attr("height", y_scale.bandwidth());
  }, []);
  return <div ref={timelineRef}></div>;
}
