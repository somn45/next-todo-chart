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
