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

export const setGraphArea = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  margin: D3Layout["margin"],
) =>
  svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
