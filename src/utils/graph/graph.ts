import * as d3 from "d3";
import { formatByISO8601 } from "../date/formatByISO8601";
import { ILineGraphData, LookupedTodo, WithStringifyId } from "@/types/schema";
import caculateBandLength from "@/app/(private)/stats/_utils/caculateBandLength";
import { getEndOfPeriod, getStartOfPeriod } from "../date/getDateInCurrentDate";

interface GraphMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

type dateDomainBaseType = "week" | "month" | "year";

type linearScaleType = {
  type: "linearScale";
  linearScale: d3.ScaleLinear<number, number, never>;
};
type bandScaleType = {
  type: "bandScale";
  bandScale: d3.ScaleBand<string>;
};

interface D3Layout {
  width: number;
  height: number;
  margin: GraphMargin;
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

interface createTimeScaleParams<T extends { date: Date }> {
  rangeMax: number;
  timeScaleDomain?: [Date, Date];
  data?: T[];
}

interface DataPoint {
  date: Date;
  count: number;
}

class GraphCore {
  constructor(
    protected width: number,
    protected height: number,
    private graphMargin: GraphMargin,
    protected dateDomainBase: dateDomainBaseType,
    protected texts: string[],
    protected colors: string[],
    protected svg?: d3.Selection<SVGGElement, unknown, null, undefined>,
  ) {
    this.width = width;
    this.height = height;
    this.dateDomainBase = dateDomainBase;
    this.graphMargin = graphMargin;
    this.texts = texts;
    this.colors = colors;
  }
  // 그래프 요소들을 담을 svg 컨테이너 생성
  createSvgContainer = (graphContainerElement: HTMLDivElement | null) => {
    const svg = d3
      .select(graphContainerElement)
      .append("svg")
      .attr("data-testid", "svg container")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("data-testid", "graph area")
      .attr(
        "transform",
        `translate(${this.graphMargin.left}, ${this.graphMargin.top})`,
      );
    this.svg = svg;
  };

  // 그래프의 요소 레이아웃과 좌표 계산
  caculateGraphLayout = () => {
    // graph inner

    const graphInnerWidth =
      this.width - this.graphMargin.left - this.graphMargin.right;
    const graphInnerHeight =
      this.height - this.graphMargin.top - this.graphMargin.bottom;

    // title 시작 위치
    const titleStartOffset = this.width - this.graphMargin.left;

    // legend 시작 위치
    const legendStartOffset = graphInnerWidth + this.graphMargin.right / 4;

    return {
      innerWidth: graphInnerWidth,
      innerHeight: graphInnerHeight,
      titleStartOffset,
      legendStartOffset,
    };
  };

  // x Axis 설정
  setXAxis = (
    scale: d3.ScaleTime<number, number, never>,
    tickCount: number,
    innerHeight: number,
  ) => {
    if (this.svg) {
      this.svg
        .append("g")
        .attr("class", "xAxis")
        .attr("data-testid", "x axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(
          d3
            .axisBottom(scale)
            .ticks(tickCount)
            .tickFormat(d =>
              this.dateDomainBase === "year"
                ? (new Date(d.toString()).getMonth() + 1).toString()
                : formatByISO8601(d),
            ),
        );
    }
  };

  // y Axis 설정
  setYAxis = (scale: linearScaleType | bandScaleType) => {
    if (this.svg) {
      if ("linearScale" in scale) {
        this.svg
          .append("g")
          .attr("data-testid", "y axis")
          .call(d3.axisLeft(scale.linearScale));
      } else {
        this.svg
          .append("g")
          .attr("data-testid", "y axis")
          .call(d3.axisLeft(scale.bandScale));
      }
    }
  };

  // 특정 상태와 매칭되는 그래프 마커(라인, 밴드 등)의 색상 스케일 반환
  createColorScale = () =>
    d3.scaleOrdinal<string>().domain(this.texts).range(this.colors);
}

export class LineGraph extends GraphCore {
  // 제목 추가
  addTitle = (y: number, width: number, title: string) => {
    if (this.svg) {
      this.svg
        .append("text")
        .attr("aria-label", "graph title")
        .attr("x", this.width / 2)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .text(title);
    }
  };

  // 범례 목록이 담길 g 요소 추가
  createLegend = (legendStartOffset: number) => {
    if (this.svg) {
      return this.svg
        .append("g")
        .attr("data-testid", "legend list")
        .attr("class", "legend")
        .attr("transform", `translate(${legendStartOffset}, 0)`);
    }
    return null;
  };

  // 라인 모양의 범례 마커 추가
  private setLegendRectMarker = (
    markerType: D3MarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    markerLayout: Omit<D3Layout, "margin" | "radius">,
    coord: Pick<D3Coord, "x" | "y">,
    color: string,
  ) => {
    const { width, height } = markerLayout;
    const { x, y } = coord;

    legend
      .append(markerType)
      .attr("class", "legendCategory")
      .attr("data-testid", "legend category")
      .attr("width", width)
      .attr("height", height)
      .attr("x", x)
      .attr("y", y)
      .attr("fill", color);
  };

  // 범례 텍스트 추가
  private setLegendText = (
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    coord: Pick<D3Coord, "x" | "y">,
    text: string,
  ) => {
    const { x, y } = coord;
    legend
      .append("text")
      .attr("class", "legendText")
      .attr("data-testid", "legend text")
      .attr("font-size", "12px")
      .attr("x", x)
      .attr("y", y)
      .text(text);
  };

  // 그래프의 범례 목록 설정
  setLegendItems(
    markerType: D3MarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    markerLayout: Partial<Omit<legendAttr, "margin">>,
    initCoord: D3Coord,
  ) {
    const markerWidth = markerLayout.width ?? 0;
    const markerHeight = markerLayout.height ?? 0;
    const radius = markerLayout.radius ?? 0;

    const legendContents = this.colors.map((color, i) => [
      color,
      this.texts[i],
    ]);
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

      this.setLegendRectMarker(
        markerType,
        legend,
        { width: markerWidth, height: markerHeight },
        coord,
        color,
      );

      this.setLegendText(legend, textCoord, text);
    });
  }

  // 시간 스케일 설정
  createTimeScale = <T extends { date: Date }>({
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

  // 선형 스케일 설정
  createLinearScale = <T extends { count: number }>(
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

  // 그래프 그리기
  drowGraph = (
    groupedData: d3.InternMap<string, ILineGraphData[]>,
    color: d3.ScaleOrdinal<string, string, never>,
    lineGenerator: d3.Line<DataPoint>,
  ) => {
    if (this.svg) {
      this.svg
        .selectAll(".line")
        .data(groupedData.entries())
        .enter()
        .append("path")
        .attr("data-testid", "line")
        .attr("fill", "none")
        .attr("stroke", d => color(d[0]))
        .attr("stroke-width", 2.5)
        .attr("d", d => lineGenerator(d[1]));
    }
  };
}

export class BandGraph extends GraphCore {
  // 제목 추가
  addTitle = (y: number, width: number, title: string) => {
    if (this.svg) {
      this.svg
        .append("text")
        .attr("aria-label", "graph title")
        .attr("x", this.width / 2)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .text(title);
    }
  };

  // 범례 목록이 담길 g 요소 추가
  createLegend = (legendStartOffset: number) => {
    if (this.svg) {
      return this.svg
        .append("g")
        .attr("data-testid", "legend list")
        .attr("class", "legend")
        .attr("transform", `translate(${legendStartOffset}, 0)`);
    }
    return null;
  };

  // 원 보양의 범례 마커 배치
  private setLegendCircleMarker(
    markerType: D3MarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    radius: number,
    coord: Pick<D3Coord, "x" | "y">,
    color: string,
  ) {
    const { x, y } = coord;

    legend
      .append(markerType)
      .attr("class", "legendCategory")
      .attr("data-testid", "legend category")
      .attr("r", radius)
      .attr("cx", x)
      .attr("cy", y)
      .attr("fill", color);
  }

  // 범례 텍스트 추가
  private setLegendText = (
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    coord: Pick<D3Coord, "x" | "y">,
    text: string,
  ) => {
    const { x, y } = coord;
    legend
      .append("text")
      .attr("class", "legendText")
      .attr("data-testid", "legend text")
      .attr("font-size", "12px")
      .attr("x", x)
      .attr("y", y)
      .text(text);
  };

  // 그래프의 범례 목록 설정
  setLegendItems(
    markerType: D3MarkerType,
    legend: d3.Selection<SVGGElement, unknown, null, undefined>,
    markerLayout: Partial<Omit<legendAttr, "margin">>,
    initCoord: D3Coord,
  ) {
    const radius = markerLayout.radius ?? 0;

    const legendContents = this.colors.map((color, i) => [
      color,
      this.texts[i],
    ]);
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

      this.setLegendCircleMarker(markerType, legend, radius, coord, color);
      this.setLegendText(legend, textCoord, text);
    });
  }

  // 시간 스케일 설정
  createTimeScale = <T extends { date: Date }>({
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

  // 밴드 스케일 설정
  createBandScale = <T extends { text: string }>(
    data: T[],
    rangeMax: number,
    padding: number,
  ) =>
    d3
      .scaleBand()
      .domain(data.map(content => content.text))
      .range([0, rangeMax])
      .padding(padding);

  // 밴드 그래프 그리기
  drowBandGraph = (
    data: (LookupedTodo & WithStringifyId)[],
    scale: {
      x: d3.ScaleTime<number, number, never>;
      y: d3.ScaleBand<string>;
      color: d3.ScaleOrdinal<string, string, never>;
    },
  ) => {
    const startOfPeriod = getStartOfPeriod(this.dateDomainBase);
    const endOfPeriod = getEndOfPeriod(this.dateDomainBase);

    if (this.svg) {
      this.svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("data-testid", "band")
        .attr("fill", d => scale.color(d.content.state))
        .attr("x", d => {
          if (
            startOfPeriod.getTime() > new Date(d.content.createdAt).getTime()
          ) {
            return scale.x(startOfPeriod);
          }
          return scale.x(new Date(d.content.createdAt));
        })
        .attr("y", d => scale.y(d.content.textField)!)
        .attr("width", d =>
          caculateBandLength(
            d.content,
            { x_scale: scale.x },
            { domainStart: startOfPeriod, domainEnd: endOfPeriod },
          ),
        )
        .attr("height", scale.y.bandwidth());
    }
  };
}
