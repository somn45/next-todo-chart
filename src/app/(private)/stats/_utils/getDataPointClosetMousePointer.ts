import * as d3 from "d3";
import { getClosestYOffset } from "./getClosestYOffset";
import { TodoStat } from "@/types/stats/schema";

interface TimeBasedLinearScale {
  x_scale: d3.ScaleTime<number, number, never>;
  y_scale: d3.ScaleLinear<number, number, never>;
}

export const getDataPointClosetMousePointer = (
  groupedData: d3.InternMap<string, TodoStat[]>,
  graphScale: TimeBasedLinearScale,
  event: MouseEvent,
) => {
  const { x_scale, y_scale } = graphScale;

  const [mouseXCoord, mouseYCoord] = d3.pointer(event, this);

  const dateMatchedMouseXCoord = x_scale.invert(mouseXCoord);

  const stats = Array.from(groupedData)[0][1];
  const xAxisKeys = stats.map(stat => stat.date);

  // 마우스 포인터의 x 축과 가장 가까운 x축 키 찾기
  const xAxisKeyClosestMouseXCoord = d3.bisectCenter(
    xAxisKeys,
    dateMatchedMouseXCoord,
  );

  // 마우스 포인터의 x 축과 가장 가까운 데이터셋 index
  const statsByDate = Array.from(groupedData).map(data => {
    const dataPoint = data[1][xAxisKeyClosestMouseXCoord];
    return Math.abs(y_scale(dataPoint.count) - mouseYCoord);
  });

  const dataPointClosedYCoord = statsByDate.indexOf(Math.min(...statsByDate));

  const target =
    Array.from(groupedData)[dataPointClosedYCoord][1][
      xAxisKeyClosestMouseXCoord
    ];
  return { ...target, y_pixel: y_scale(target.count) };
};
