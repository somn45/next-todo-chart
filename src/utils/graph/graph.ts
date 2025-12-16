import * as d3 from "d3";
import { formatByISO8601 } from "../date/formatByISO8601";

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

interface legendAttr extends D3Layout {
  radius: number;
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

// 범례를 추가할 위치 조정
export const createLegend = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  width: number,
) => svg.append("g").attr("transform", `translate(${width}, 0)`);

// 범례 목록 추가를 위한 준비
export const setLegendItems = (
  markerType: D3MarkerType,
  legend: d3.Selection<SVGGElement, unknown, null, undefined>,
  layout: Partial<Omit<legendAttr, "margin">>,
  initCoord: D3Coord,
  colors: string[],
  texts: string[],
) => {
  const width = layout.width ?? 0;
  const height = layout.height ?? 0;
  const radius = layout.radius ?? 0;

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
    markerType === "rect"
      ? setLegendRectMarker(markerType, legend, { width, height }, coord, color)
      : setLegendCircleMarker(markerType, legend, radius, coord, color);
    setLegendText(legend, textCoord, text);
  });
};

// 범례 마커 추가
export const setLegendRectMarker = (
  markerType: D3MarkerType,
  legend: d3.Selection<SVGGElement, unknown, null, undefined>,
  layout: Omit<D3Layout, "margin" | "radius">,
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

export const setLegendCircleMarker = (
  markerType: D3MarkerType,
  legend: d3.Selection<SVGGElement, unknown, null, undefined>,
  radius: number,
  coord: Pick<D3Coord, "x" | "y">,
  color: string,
) => {
  const { x, y } = coord;

  legend
    .append(markerType)
    .attr("r", radius)
    .attr("cx", x)
    .attr("cy", y)
    .attr("fill", color);
};

// 범례 텍스트 추가
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

// 밴드 스케일 생성
export const createBandScale = <T extends { text: string }>(
  data: T[],
  rangeMax: number,
  padding: number,
) =>
  d3
    .scaleBand()
    .domain(data.map(content => content.text))
    .range([0, rangeMax])
    .padding(padding);

interface createTimeScaleParams<T extends { date: Date }> {
  rangeMax: number;
  timeScaleDomain?: [Date, Date];
  data?: T[];
}

// 시간 스케일 생성
export const createTimeScale = <T extends { date: Date }>({
  rangeMax,
  timeScaleDomain,
  data,
}: createTimeScaleParams<T>) => {
  if (data) {
    return d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, rangeMax]);
  } else if (timeScaleDomain) {
    return d3.scaleTime().domain(timeScaleDomain).range([0, rangeMax]);
  }
  return d3.scaleTime().domain([]).range([0, rangeMax]);
};

// x 축을 svg 컨테이너에 set
export const setXAxis = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.ScaleTime<number, number, never>,
  tickCount: number,
  height: number,
) => {
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(
      d3
        .axisBottom(scale)
        .ticks(tickCount)
        .tickFormat((d, _) => formatByISO8601(d)),
    );
};

// 정량 데이터 스케일 생성
export const createLinearScale = <T extends { count: number }>(
  data: T[],
  rangeMax: number,
) => {
  const linearScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.count)] as [number, number])
    .range([rangeMax, 0])
    .nice(1);
  return linearScale;
};

// y 축을 svg 컨테이너에 set
export const setYAxis = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.ScaleLinear<number, number, never>,
) => {
  svg.append("g").call(d3.axisLeft(scale));
};

// 그래프에 마우스를 따라오는 포커스 생성
export const createFollowMouseFocus = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  focusType: "circle" | "rect",
  radius: number,
) => {
  const focus = svg
    .append("g")
    .append("circle")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("r", radius)
    .style("opacity", 0);

  return focus;
};

// 그래프의 라인과 색상 매치
export const createColorScale = (
  keys: Iterable<string>,
  colors: Array<string>,
) => d3.scaleOrdinal<string>().domain(keys).range(colors);
