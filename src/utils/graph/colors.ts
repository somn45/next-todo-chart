import * as d3 from "d3";

// 그래프의 라인과 색상 매치
export const createColorScale = (
  keys: Iterable<string>,
  colors: Array<string>,
) => d3.scaleOrdinal<string>().domain(keys).range(colors);
