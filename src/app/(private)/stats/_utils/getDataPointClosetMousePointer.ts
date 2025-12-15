import * as d3 from "d3";
import { getClosestYOffset } from "./getClosestYOffset";

interface LineGraphData {
  date: Date;
  state: string;
  count: number;
}

interface TimeBasedLinearScale {
  x_scale: d3.ScaleTime<number, number, never>;
  y_scale: d3.ScaleLinear<number, number, never>;
}

export const getDataPointClosetMousePointer = (
  groupedData: d3.InternMap<string, LineGraphData[]>,
  graphScale: TimeBasedLinearScale,
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

  const statsByArray = Array.from(groupedData);

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
  return target;
};
