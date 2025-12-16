"use client";

import { LookupedTodo, WithStringifyId } from "@/types/schema";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  addTitle,
  createBandScale,
  createColorScale,
  createLegend,
  createSVGContainer,
  createTimeScale,
  setLegendItems,
  setXAxis,
} from "@/utils/graph/graph";
import { formatByISO8601 } from "@/utils/date/formatByISO8601";
import caculateBandLength from "./_utils/caculateBandLegnth";

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

    const svg = createSVGContainer(
      { width, height, margin },
      timelineRef.current,
    );

    addTitle(svg, width / 2, -50, "금주 투두 진행 타임라인");

    const legend = createLegend(svg, width - 50);

    const colors = ["#3498DB", "#FFA500", "#2ECC71"];
    const texts = ["할 일", "진행 중", "완료"];
    const legendInitCoord = {
      x: 0,
      y: 0,
      textX: 12,
      textY: 4,
    };

    setLegendItems(
      "circle",
      legend,
      { radius: 5 },
      legendInitCoord,
      colors,
      texts,
    );

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

    const x_scale = createTimeScale({
      rangeMax: width - 80,
      timeScaleDomain: [currentWeekFirstDay, currentWeekLastDay],
    });
    setXAxis(svg, x_scale, 8, height);

    const y_scale = createBandScale(
      todos.map(todo => ({ text: todo.content.textField })),
      height,
      0.2,
    );
    svg.append("g").call(d3.axisLeft(y_scale));

    const color_scale = createColorScale(texts, colors);

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
      .attr("width", d =>
        caculateBandLength(
          d.content,
          { x_scale },
          { domainStart: currentWeekFirstDay, domainEnd: currentWeekLastDay },
        ),
      )
      .attr("height", y_scale.bandwidth());
  }, []);
  return <div ref={timelineRef}></div>;
}
