import {
  D3ScaleType,
  DataDomainBaseType,
  GraphMargin,
} from "@/types/graph/schema";
import { select } from "d3-selection";
import { scaleOrdinal } from "d3-scale";

export abstract class Graph {
  protected _svg:
    | d3.Selection<SVGSVGElement, unknown, null, undefined>
    | undefined = undefined;
  protected _graphGroup:
    | d3.Selection<SVGGElement, unknown, null, undefined>
    | undefined = undefined;
  constructor(
    protected width: number,
    protected height: number,
    protected graphMargin: GraphMargin,
    protected dateDomainBase: DataDomainBaseType,
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

  set svg(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    this._svg = svg;
  }

  set graphGroup(
    graphGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  ) {
    this._graphGroup = graphGroup;
  }

  get svg() {
    if (!this._svg) throw new Error("생성된 svg가 존재하지 않습니다.");
    return this._svg;
  }

  get graphGroup() {
    if (!this._graphGroup) throw new Error("생성된 g가 존재하지 않습니다.");
    return this._graphGroup;
  }

  // 그래프 요소들을 담을 svg 컨테이너 생성
  protected createSvgContainer = (
    graphContainerElement: HTMLDivElement | null,
  ) => {
    const svg = select(graphContainerElement)
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

  // 특정 상태와 매칭되는 그래프 마커(라인, 밴드 등)의 색상 스케일 반환
  protected createColorScale = () =>
    scaleOrdinal<string>().domain(this.texts).range(this.colors);

  protected abstract setXAxis(
    scale: d3.ScaleTime<number, number, never>,
    tickCount: number,
    innerHeight: number,
  ): void;

  protected abstract setYAxis(scale: D3ScaleType): void;
}
