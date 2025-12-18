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

// 범례를 추가할 위치 조정
export const createLegend = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  width: number,
) =>
  svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width}, 0)`);

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
    .attr("class", "legendCategory")
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
    .attr("class", "legendCategory")
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
    .attr("class", "legendText")
    .attr("font-size", "12px")
    .attr("x", x)
    .attr("y", y)
    .text(text);
};
