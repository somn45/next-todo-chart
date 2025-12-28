import createDatesOfCurrentWeek from "@/utils/date/createDatesOfCurrentWeek";

jest.useFakeTimers();
jest.setSystemTime(new Date(2025, 6, 10));

describe("createDatesOfCurrentWeek 유틸 함수", () => {
  it("createDatesOfCurrentWeek 실행 시 현재 날짜를 기준으로 이번 주에 해당하는 날짜 배열을 생성한다.", () => {
    const currentWeek = createDatesOfCurrentWeek();
    const expectedDateList = [
      new Date(2025, 6, 6),
      new Date(2025, 6, 7),
      new Date(2025, 6, 8),
      new Date(2025, 6, 9),
      new Date(2025, 6, 10),
      new Date(2025, 6, 11),
      new Date(2025, 6, 12),
    ];

    expect(currentWeek).toHaveLength(7);
    expect(currentWeek).toEqual(expectedDateList);
  });
});
