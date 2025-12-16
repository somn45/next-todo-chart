import * as d3 from "d3";

// 밴드 스케일 생성
export const createBandScale = <T extends { text: string }>(
  data: T[],
  rangeMax: number,
  padding: number,
) =>
  d3
    .scaleBand()
    .domain(data.map(content => content.text))
    .range([0, rangeMax])
    .padding(padding);

interface createTimeScaleParams<T extends { date: Date }> {
  rangeMax: number;
  timeScaleDomain?: [Date, Date];
  data?: T[];
}

// 시간 스케일 생성
export const createTimeScale = <T extends { date: Date }>({
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

// 정량 데이터 스케일 생성
export const createLinearScale = <T extends { count: number }>(
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
