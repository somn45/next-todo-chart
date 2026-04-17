interface moveTooltipPositionProps {
  tooltipSelection: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  graphArea: d3.Selection<SVGGElement, unknown, null, undefined>;
  originPositionX: number;
}

export const moveTooltipPosition = ({
  tooltipSelection,
  graphArea,
  originPositionX,
}: moveTooltipPositionProps) => {
  const tooltipOffsetRight = tooltipSelection
    .node()
    ?.getBoundingClientRect().right;
  const windowWidth = window.innerWidth;
  const eventAreaOffsetRight = graphArea.node()?.getBoundingClientRect().right;

  if (!tooltipOffsetRight || !eventAreaOffsetRight) return;

  const tooltipOffsetLeft = tooltipSelection
    .node()
    ?.getBoundingClientRect().left;
  const eventAreaOffsetLeft = graphArea.node()?.getBoundingClientRect().left;

  if (!tooltipOffsetLeft || !eventAreaOffsetLeft) return;

  let tooltipPositionLeft = originPositionX;
  if (
    tooltipOffsetRight > windowWidth ||
    tooltipOffsetRight > eventAreaOffsetRight
  ) {
    tooltipPositionLeft -= 30;
  } else if (tooltipOffsetLeft < eventAreaOffsetLeft) {
    tooltipPositionLeft += 30;
  }

  return tooltipPositionLeft;
};
