/**
 * 그래프의 그룹화된 라인의 y 좌표 중
 * 마우스 포인터의 y 좌표와 가장 가까운 값을 구한다.
 */
export const getClosestYOffset = <T extends { y_pixel: number }>(
  points: T[],
  mouseYCoord: number,
) => {
  const subYPixel = points.map(point => Math.abs(point.y_pixel - mouseYCoord));
  const index = subYPixel.indexOf(Math.min(...subYPixel));
  return points[index];
};
