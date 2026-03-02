import { LegendMarkerType } from "@/types/graph/schema";
import { SerializedTodo, TodosType } from "@/types/todos/schema";
import * as d3 from "d3";

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

interface createTimeScaleParams {
  rangeMax: number;
  timeScaleDomain: [Date, Date];
}

export interface BandGraphMainContent {
  createTimeScale({
    rangeMax,
    timeScaleDomain,
  }: createTimeScaleParams): d3.ScaleTime<number, number, never>;
  createBandScale<T extends { text: string }>(
    data: T[],
    rangeMax: number,
    padding: number,
  ): d3.ScaleBand<string>;
  setBandDataset(
    scale: {
      x: d3.ScaleTime<number, number, never>;
      y: d3.ScaleBand<string>;
      color: d3.ScaleOrdinal<string, string, never>;
    },
    data: Array<TodosType & SerializedTodo>,
  ): void;
}

export interface BandGraphSubContent {
  addTitle(y: number, width: number, title: string): void;
  createLegend(
    legendStartOffset: number,
  ): d3.Selection<SVGGElement, unknown, null, undefined>;
  setLegendItems(
    markerType: LegendMarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    markerLayout: Partial<Omit<legendAttr, "margin">>,
    initCoord: D3Coord,
  ): void;
}
