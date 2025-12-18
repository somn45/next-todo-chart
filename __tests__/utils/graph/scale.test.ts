import {
  createBandScale,
  createLinearScale,
  createTimeScale,
} from "@/utils/graph";

const mockData = [
  {
    text: "일찍 일어나기",
    date: new Date(2025, 6, 1),
    progressDays: 3,
  },
  {
    text: "양치하기",
    date: new Date(2025, 6, 3),
    progressDays: 5,
  },
];

describe("D3 scale function", () => {
  it("createBandScale 함수 사용 시 domain은 인수로 할당받은 데이터의 텍스트 배열이, range는 인수에서 받은 0 ~ rangeMax 값이 설정된다.", () => {
    const mockHeightRangeMax = 360;
    const mockBandPadding = 0.2;

    const bandScale = createBandScale(
      mockData,
      mockHeightRangeMax,
      mockBandPadding,
    );

    expect(bandScale.domain()).toEqual(mockData.map(data => data.text));
    expect(bandScale.range()).toEqual([0, mockHeightRangeMax]);
    expect(bandScale.padding()).toEqual(0.2);
  });
  it("createTimeScale 함수 사용시 domain은 인수로 할당받은 데이터에서 혹은 임의의 date 최소값과 최대값 배열, range는 인수에서 받은 0 ~ rangeMax 값이 설정된다.", () => {
    const mockWidthRangeMax = 540;
    const mockTimeScaleDomain: [Date, Date] = [
      new Date(2025, 6, 1),
      new Date(2025, 6, 7),
    ];

    const timeScaleAssignArbitraryDomain = createTimeScale({
      rangeMax: mockWidthRangeMax,
      timeScaleDomain: mockTimeScaleDomain,
    });

    expect(timeScaleAssignArbitraryDomain.domain()).toEqual([
      new Date(2025, 6, 1),
      new Date(2025, 6, 7),
    ]);
    expect(timeScaleAssignArbitraryDomain.range()).toEqual([
      0,
      mockWidthRangeMax,
    ]);
    expect(timeScaleAssignArbitraryDomain(new Date(2025, 6, 4))).toEqual(
      mockWidthRangeMax / 2,
    );

    const timeScaleAssignData = createTimeScale({
      rangeMax: mockWidthRangeMax,
      data: mockData,
    });

    expect(timeScaleAssignData.domain()).toEqual([
      new Date(2025, 6, 1),
      new Date(2025, 6, 3),
    ]);
    expect(timeScaleAssignData.range()).toEqual([0, mockWidthRangeMax]);
    expect(timeScaleAssignData(new Date(2025, 6, 2))).toEqual(
      mockWidthRangeMax / 2,
    );
  });
  it("createLinearScale 함수 사용 시 domain은 인수로 할당맏은 데이터의 특정 value,  range는 인수에서 받은 0 ~ rangeMax 값이 설정된다.", () => {
    const mockWidthRangeMax = 540;

    const linearScale = createLinearScale(
      mockData.map(data => ({ ...data, count: data.progressDays })),
      mockWidthRangeMax,
    );

    const dataMaxCount = Math.max(...mockData.map(data => data.progressDays));

    expect(linearScale.domain()).toEqual([0, dataMaxCount]);
    expect(linearScale.range()).toEqual([mockWidthRangeMax, 0]);
    expect(linearScale(3)).toEqual((540 * (5 - 3)) / 5);
  });
});
