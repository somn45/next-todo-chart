import {
  DatDataPoint,
  LegendMarkerLayout,
  LegendMarkerType,
  LegendUnitInitCoord,
} from "@/types/graph/schema";
import { TodoStat } from "@/types/stats/schema";
import * as d3 from "d3";

interface createTimeScaleParams<T extends { date: Date }> {
  rangeMax: number;
  data: T[];
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
    lineGenerator: d3.Line<DatDataPoint>,
  ): void;
}

export interface GraphSubContent {
  addTitle(y: number, width: number, title: string): void;
  createLegend(
    legendStartOffset: number,
  ): d3.Selection<SVGGElement, unknown, null, undefined>;
  setLegendItems(
    markerType: LegendMarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    markerLayout: Partial<Omit<LegendMarkerLayout, "margin">>,
    initCoord: LegendUnitInitCoord,
  ): void;
}
