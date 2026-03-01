import { TodoStat } from "@/types/graph/schema";
import * as d3 from "d3";

type D3MarkerType = "circle" | "rect";

interface GraphMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface D3Layout {
  width: number;
  height: number;
  margin: GraphMargin;
}

interface legendAttr extends D3Layout {
  radius: number;
}

interface D3Coord {
  x: number;
  y: number;
  textX: number;
  textY: number;
}

interface createTimeScaleParams<T extends { date: Date }> {
  rangeMax: number;
  data: T[];
}

interface DataPoint {
  date: Date;
  count: number;
}

export interface GraphMainContent {
  createTimeScale<T extends { date: Date }>({
    rangeMax,
    data,
  }: createTimeScaleParams<T>): d3.ScaleTime<number, number, never>;
  createLinearScale<T extends { count: number }>(
    data: T[],
    rangeMax: number,
  ): d3.ScaleLinear<number, number, never>;
  setLineDataset(
    groupedData: d3.InternMap<string, TodoStat[]>,
    color: d3.ScaleOrdinal<string, string, never>,
    lineGenerator: d3.Line<DataPoint>,
  ): void;
}

export interface GraphSubContent {
  addTitle(y: number, width: number, title: string): void;
  createLegend(
    legendStartOffset: number,
  ): d3.Selection<SVGGElement, unknown, null, undefined>;
  setLegendItems(
    markerType: D3MarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    markerLayout: Partial<Omit<legendAttr, "margin">>,
    initCoord: D3Coord,
  ): void;
}
