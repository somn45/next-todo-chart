import { distributeByDate } from "@/app/(private)/stats/_utils/distributeByDate";
import { mockStats } from "../../../__mocks__/stats";

describe("distributeByDate 유틸 함수", () => {
  it("일별 등록된 상태별 투두 합계 데이터를 그래프에서 사용될 데이터로 피벗한다", () => {
    const lineGraphDatas = distributeByDate(mockStats);
    const expectedLineGraphdatas = [
      {
        date: new Date(2025, 6, 10),
        state: "총합",
        count: 9,
      },
      {
        date: new Date(2025, 6, 10),
        state: "할 일",
        count: 2,
      },
      {
        date: new Date(2025, 6, 10),
        state: "진행 중",
        count: 3,
      },
      {
        date: new Date(2025, 6, 10),
        state: "완료",
        count: 4,
      },
      {
        date: new Date(2025, 6, 11),
        state: "총합",
        count: 7,
      },
      {
        date: new Date(2025, 6, 11),
        state: "할 일",
        count: 4,
      },
      {
        date: new Date(2025, 6, 11),
        state: "진행 중",
        count: 2,
      },
      {
        date: new Date(2025, 6, 11),
        state: "완료",
        count: 1,
      },
    ];

    expect(lineGraphDatas).toEqual(expectedLineGraphdatas);
  });
});
