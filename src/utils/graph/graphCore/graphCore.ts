import * as d3 from "d3";

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

export abstract class Graph {
  protected svg:
    | d3.Selection<SVGSVGElement, unknown, null, undefined>
    | undefined = undefined;
  protected graphGroup:
    | d3.Selection<SVGGElement, unknown, null, undefined>
    | undefined = undefined;
  constructor(
    protected width: number,
    protected height: number,
    private graphMargin: GraphMargin,
    protected dateDomainBase: dateDomainBaseType,
    protected texts: string[],
    protected colors: string[],
  ) {
    this.width = width;
    this.height = height;
    this.dateDomainBase = dateDomainBase;
    this.graphMargin = graphMargin;
    this.texts = texts;
    this.colors = colors;
  }

  get getGraphGroup() {
    return this.graphGroup;
  }

  // 그래프 요소들을 담을 svg 컨테이너 생성
  protected createSvgContainer = (
    graphContainerElement: HTMLDivElement | null,
  ) => {
    const svg = d3
      .select(graphContainerElement)
      .append("svg")
      .attr("data-testid", "svg container")
      .attr("width", this.width)
      .attr("height", this.height);

    const groupGroup = svg
      .append("g")
      .attr("data-testid", "graph area")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr(
        "transform",
        `translate(${this.graphMargin.left}, ${this.graphMargin.top})`,
      );
    this.svg = svg;
    this.graphGroup = groupGroup;
  };

  // 그래프 컨테이너 내의 그룹 레이아웃과 title, legend 좌표 계산
  protected caculateGraphLayout = () => {
    // graph inner
    const graphInnerWidth =
      this.width - this.graphMargin.left - this.graphMargin.right;
    const graphInnerHeight =
      this.height - this.graphMargin.top - this.graphMargin.bottom;

    // title 시작 위치
    const titleStartOffset =
      this.width - this.graphMargin.left + this.graphMargin.right;

    // legend 시작 위치
    const legendStartOffset = this.width - 60;

    return {
      innerWidth: graphInnerWidth,
      innerHeight: graphInnerHeight,
      titleStartOffset,
      legendStartOffset,
    };
  };

  // 특정 상태와 매칭되는 그래프 마커(라인, 밴드 등)의 색상 스케일 반환
  protected createColorScale = () =>
    d3.scaleOrdinal<string>().domain(this.texts).range(this.colors);

  protected abstract setXAxis(
    scale: d3.ScaleTime<number, number, never>,
    tickCount: number,
    innerHeight: number,
  ): void;

  protected abstract setYAxis(scale: linearScaleType | bandScaleType): void;
}
