import * as d3 from "d3";

interface D3Layout {
  width: number;
  height: number;
  margin: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
}

// 그래프를 그릴 컨테이너 생성
export const createSVGContainer = (
  layout: D3Layout,
  divElement: HTMLDivElement | null,
) => {
  const { width, height, margin } = layout;

  if (!divElement) throw new Error("그래프를 그리는 도중 문제가 발생했습니다.");

  const svg = d3
    .select(divElement)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  return svg;
};
