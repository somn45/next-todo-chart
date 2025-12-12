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

interface D3Coord {
  x: number;
  y: number;
  textX: number;
  textY: number;
}

type D3MarkerType = "circle" | "rect";

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

// 그래프 타이틀 추가
export const addTitle = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: number,
  y: number,
  title: string,
) => {
  svg
    .append("text")
    .attr("x", x)
    .attr("y", y)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .text(title);
};

// 범례 추가
export const createLegend = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  width: number,
) => svg.append("g").attr("transform", `translate(${width}, 0)`);

export const setLegendItems = (
  markerType: D3MarkerType,
  legend: d3.Selection<SVGGElement, unknown, null, undefined>,
  layout: Omit<D3Layout, "margin">,
  initCoord: D3Coord,
  colors: string[],
  texts: string[],
) => {
  const legendContents = colors.map((color, i) => [color, texts[i]]);
  legendContents.forEach((content, i) => {
    const [color, text] = content;
    const { x, y, textX, textY } = initCoord;

    const coord = {
      x,
      y: y + 25 * i,
    };
    const textCoord = {
      x: textX,
      y: textY + 25 * i,
    };
    setLegendMarker(markerType, legend, layout, coord, color);
    setLegendText(legend, textCoord, text);
  });
};

export const setLegendMarker = (
  markerType: D3MarkerType,
  legend: d3.Selection<SVGGElement, unknown, null, undefined>,
  layout: Omit<D3Layout, "margin">,
  coord: Pick<D3Coord, "x" | "y">,
  color: string,
) => {
  const { width, height } = layout;
  const { x, y } = coord;
  legend
    .append(markerType)
    .attr("width", width)
    .attr("height", height)
    .attr("x", x)
    .attr("y", y)
    .attr("fill", color);
};

export const setLegendText = (
  legend: d3.Selection<SVGGElement, unknown, null, undefined>,
  coord: Pick<D3Coord, "x" | "y">,
  text: string,
) => {
  const { x, y } = coord;
  legend
    .append("text")
    .attr("font-size", "12px")
    .attr("x", x)
    .attr("y", y)
    .text(text);
};
