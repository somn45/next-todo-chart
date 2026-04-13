import { GRAPH_LEGEND_PADDING_RIGHT } from "@/constants/graph";
import { GraphMargin } from "@/types/graph/schema";

// 그래프 루트 내 캔버스(g)의 레이아웃과 title, legend 시작 좌표 계산
export const caculateGraphLayout = (
  outerWidth: number,
  outerHeight: number,
  graphMargin: GraphMargin,
) => {
  // graph inner
  const graphInnerWidth = outerWidth - graphMargin.left - graphMargin.right;
  const graphInnerHeight = outerHeight - graphMargin.top - graphMargin.bottom;

  // title 시작 위치
  const titleStartOffset =
    graphMargin.left + (outerWidth - graphMargin.left - graphMargin.right) / 2;

  // legend 시작 위치
  const legendStartOffset = outerWidth - GRAPH_LEGEND_PADDING_RIGHT;

  return {
    innerWidth: graphInnerWidth,
    innerHeight: graphInnerHeight,
    titleStartOffset,
    legendStartOffset,
  };
};

// 4    o
// ooooooo

// 4.5
// Xoooooo

// 3.5
// 000000X

//    o
// XoooooX
