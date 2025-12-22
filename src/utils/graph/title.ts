// 그래프 타이틀 추가
export const addTitle = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: number,
  y: number,
  title: string,
) => {
  svg
    .append("text")
    .attr("aria-label", "graph title")
    .attr("x", x)
    .attr("y", y)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .text(title);
};
