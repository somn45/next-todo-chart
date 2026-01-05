import * as d3 from "d3";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import {
  createBandScale,
  createColorScale,
  createSVGContainer,
  createTimeScale,
} from "@/utils/graph";
import { caculateGraphLayout } from "@/utils/graph/caculateGraphLayout";
import { RefObject, useEffect, useRef, useState } from "react";
import caculateBandLength from "../../stats/_utils/caculateBandLength";
import { setSparklineXAxis } from "@/utils/graph/axis";

interface TimeBasedBandScale {
  x_scale: d3.ScaleTime<number, number, never> | null;
  y_scale: d3.ScaleBand<string> | null;
}

type GraphConfig = {
  outerWidth: number;
  outerHeight: number;
  data: (LookupedTodo & WithStringifyId)[];
  dateDomainBase?: "week" | "month" | "year";
};

type useDrowTimelineSparklineType = (
  graphConfig: GraphConfig,
) => [
  d3.Selection<SVGGElement, unknown, null, undefined> | null,
  TimeBasedBandScale,
  RefObject<HTMLDivElement | null>,
];

// 한 페이지에 3개의 그래프가 동시에 렌더링 되므로 맨 상단에 색상 설명 추가
const useDrowTimelineSparkline: useDrowTimelineSparklineType = graphConfig => {
  const [svgContainer, setSvgContainer] = useState<d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const [graphScale, setGraphScale] = useState<TimeBasedBandScale>({
    x_scale: null,
    y_scale: null,
  });
  const timelineSparklineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = timelineSparklineRef.current;
    if (!container) return;

    const { outerWidth, outerHeight, data, dateDomainBase } = graphConfig;

    const graphMargin = { top: 80, left: 100, bottom: 20, right: 100 };
    const { innerWidth, innerHeight } = caculateGraphLayout(
      outerWidth,
      outerHeight,
      graphMargin,
    );

    const svg = createSVGContainer(
      { width: outerWidth, height: outerHeight, margin: graphMargin },
      container,
    );

    const colors = ["#3498DB", "#FFA500", "#2ECC71"];
    const texts = ["할 일", "진행 중", "완료"];

    const startOfPeriod = getStartOfPeriod(dateDomainBase || "week");
    const endOfPeriod = getEndOfPeriod(dateDomainBase || "week");

    const x_scale = createTimeScale({
      rangeMax: innerWidth,
      timeScaleDomain: [startOfPeriod, endOfPeriod],
    });
    setSparklineXAxis(svg, x_scale, 8, innerHeight, dateDomainBase);

    const y_scale = createBandScale(
      data.map(todo => ({ text: todo.content.textField })),
      innerHeight,
      0.2,
    );
    svg.append("g").attr("data-testid", "y axis").call(d3.axisLeft(y_scale));

    const color_scale = createColorScale(texts, colors);

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("data-testid", "band")
      .attr("fill", d => color_scale(d.content.state))
      .attr("x", d => {
        if (startOfPeriod.getTime() > new Date(d.content.createdAt).getTime()) {
          return x_scale(startOfPeriod);
        }
        return x_scale(new Date(d.content.createdAt));
      })
      .attr("y", d => y_scale(d.content.textField)!)
      .attr("width", d =>
        caculateBandLength(
          d.content,
          { x_scale },
          { domainStart: startOfPeriod, domainEnd: endOfPeriod },
        ),
      )
      .attr("height", y_scale.bandwidth());

    setSvgContainer(svg);
    setGraphScale({ x_scale, y_scale });
    return () => {
      d3.select(container).selectAll("*").remove();
    };
  }, []);

  return [svgContainer, graphScale, timelineSparklineRef];
};

export default useDrowTimelineSparkline;
