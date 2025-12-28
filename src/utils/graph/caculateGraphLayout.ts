interface GraphMargin {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export const caculateGraphLayout = (
  outerWidth: number,
  outerHeight: number,
  margin: GraphMargin,
) => {
  // graph inner
  const graphInnerWidth = outerWidth - margin.left - margin.right;
  const graphInnerHeight = outerHeight - margin.top - margin.bottom;

  // title 시작 위치
  const titleStartOffset = outerWidth - margin.left;

  // legend 시작 위치
  const legendStartOffset = graphInnerWidth + margin.right / 4;

  return {
    innerWidth: graphInnerWidth,
    innerHeight: graphInnerHeight,
    titleStartOffset,
    legendStartOffset,
  };
};
