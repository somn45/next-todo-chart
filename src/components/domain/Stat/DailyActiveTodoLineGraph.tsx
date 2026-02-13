"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ILineGraphData } from "@/types/schema";
import { Graph, LineGraph } from "@/utils/graph/graph";
import { caculateTickCount } from "@/utils/graph/caculateTickCount";

interface DataPoint {
  date: Date;
  count: number;
}

export default function DailyActiveTodoLineGraph({
  stats,
  dateDomainBase = "week",
}: {
  stats: ILineGraphData[];
  dateDomainBase?: "week" | "month" | "year";
}) {
  const lineGraphWrapperRef = useRef<HTMLDivElement | null>(null);
  const toolTipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const GRAPH_WIDTH = 700;
    const GRAPH_HEIGHT = 400;
    const graphMargin = { top: 80, left: 30, bottom: 20, right: 100 };

    const lineGraph = new LineGraph(
      GRAPH_WIDTH,
      GRAPH_HEIGHT,
      graphMargin,
      "week",
      ["총합", "할 일", "진행 중", "완료"],
      ["#000000", "#3498DB", "#FFA500", "#2ECC71"],
    );

    const graphContainer = lineGraphWrapperRef.current;
    lineGraph.createSvgContainer(lineGraphWrapperRef.current);
    const { innerWidth, innerHeight, titleStartOffset, legendStartOffset } =
      lineGraph.caculateGraphLayout();

    const groupedStats = d3.group(stats, d => d.state);

    lineGraph.addTitle(titleStartOffset, -50, "최근 1주간 등록된 투두 합계");

    const legend = lineGraph.createLegend(legendStartOffset);
    if (!legend) return;

    const legendMarkerSize = { width: 15, height: 2 };
    const legendInitCoord = { x: 0, y: 0, textX: 22, textY: 6 };
    lineGraph.setLegendItems("rect", legend, legendMarkerSize, legendInitCoord);

    const statsKeys = groupedStats.keys();
    const count = statsKeys.toArray().length;
    const tickCount = caculateTickCount(dateDomainBase, count, stats.length);

    const x_scale = lineGraph.createTimeScale({
      rangeMax: innerWidth,
      data: stats,
    });
    lineGraph.setXAxis(x_scale, tickCount, innerHeight);

    const y_scale = lineGraph.createLinearScale(stats, innerHeight);
    lineGraph.setYAxis(y_scale);

    const lineGenerator = d3
      .line<DataPoint>()
      .x(d => x_scale(d.date))
      .y(d => y_scale(d.count));

    const color = lineGraph.createColorScale();

    lineGraph.drowGraph(groupedStats, color, lineGenerator);

    return () => {
      d3.select(graphContainer).selectAll("*").remove();
    };
  }, [dateDomainBase]);

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
