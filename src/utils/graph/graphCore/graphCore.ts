import {
  D3ScaleType,
  DateDomainBaseType,
  GraphMargin,
} from "@/types/graph/schema";
import { select } from "d3-selection";
import { scaleOrdinal } from "d3-scale";
import { StateType } from "@/types/todos/schema";

interface GraphOptions {
  width: number;
  height: number;
  margin: GraphMargin;
  dateDomainBase: DateDomainBaseType;
  texts: StateType[];
  colors: string[];
}

export abstract class Graph {
  protected _svg:
    | d3.Selection<SVGSVGElement, unknown, null, undefined>
    | undefined = undefined;
  protected _graphGroup:
    | d3.Selection<SVGGElement, unknown, null, undefined>
    | undefined = undefined;
  protected _isMobile: boolean = false;
  constructor(protected options: GraphOptions) {
    this.options = options;
  }

  set svg(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    this._svg = svg;
  }

  set graphGroup(
    graphGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  ) {
    this._graphGroup = graphGroup;
  }

  set isMobile(width: number | boolean) {
    if (typeof width === "number") {
      this._isMobile = width <= 768 ? true : false;
    } else this._isMobile = false;
  }

  get isMobile() {
    return this._isMobile;
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
      .attr("width", this.options.width)
      .attr("height", this.options.height);

    const groupGroup = svg
      .append("g")
      .attr("data-testid", "graph area")
      .attr("width", this.options.width)
      .attr("height", this.options.height)
      .attr(
        "transform",
        `translate(${this.options.margin.left}, ${this.options.margin.top})`,
      );
    this.svg = svg;
    this.graphGroup = groupGroup;
  };

  // 특정 상태와 매칭되는 그래프 마커(라인, 밴드 등)의 색상 스케일 반환
  protected createColorScale = () =>
    scaleOrdinal<string>()
      .domain(this.options.texts)
      .range(this.options.colors);

  protected abstract setXAxis(
    scale: d3.ScaleTime<number, number, never>,
    tickCount: number,
    innerHeight: number,
  ): void;

  protected abstract setYAxis(scale: D3ScaleType): void;
}
