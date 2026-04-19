import { pointer } from "d3-selection";

interface moveTooltipPositionProps {
  tooltipSelection: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  graphArea: d3.Selection<SVGGElement, unknown, null, undefined>;
  event: MouseEvent | TouchEvent;
  eventTarget: EventTarget;
}

export const correctTooltipPosition = ({
  tooltipSelection,
  graphArea,
  event,
  eventTarget,
}: moveTooltipPositionProps) => {
  const graphAreaNode = graphArea.node();
  const tooltipNode = tooltipSelection.node();
  const eventArea = graphArea.select("rect").node() as SVGRectElement | null;

  if (!graphAreaNode || !tooltipNode || !eventArea)
    return tooltipSelection.style("transform", "translate(0, 0)");

  const touch = event instanceof TouchEvent ? event.touches[0] : event;
  const [mouseXCoord] = pointer(touch, eventTarget);
  const eventAreaWidth = eventArea.getBoundingClientRect().width;

  if (eventAreaWidth / 2 < mouseXCoord)
    tooltipSelection.style("transform", "translate(-50%, 0)");
  else tooltipSelection.style("transform", "translate(0, 0)");
};
