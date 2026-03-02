/** 데이터 집계 기준이 되는 도메인 단위 */
export type DataDomainBaseType = "week" | "month" | "year";

export interface GraphMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** 그래프 구조의 최상위 부모인 svg의 레이아웃 타입 */
export interface GraphRootLayout {
  width: number;
  height: number;
  margin: GraphMargin;
}

interface linearScaleType {
  type: "linearScale";
  linearScale: d3.ScaleLinear<number, number, never>;
}
interface bandScaleType {
  type: "bandScale";
  bandScale: d3.ScaleBand<string>;
}

/** D3 스케일 유니온 타입 */
export type D3ScaleType = linearScaleType | bandScaleType;

/** 특정 날짜의 활성화된 todo 데이터를 나타내는 객체 */
export interface DatDataPoint {
  date: Date;
  count: number;
}

/** 그래프 범례의 마커 모양 유니온 타입 */
export type LegendMarkerType = "circle" | "rect";

/** 그래프 범례 마커의 레이아웃 타입 */
export interface LegendMarkerLayout extends GraphRootLayout {
  radius: number;
}

/** 그래프 범례의 마커와 텍스트 박스의 초기 위치를 나타내는 객체 */
export interface LegendUnitInitCoord {
  x: number;
  y: number;
  textX: number;
  textY: number;
}
