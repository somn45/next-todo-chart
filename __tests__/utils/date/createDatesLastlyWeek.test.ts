import { createDatesLastlyWeek } from "@/utils/date/createDatesLastlyWeek";

jest.useFakeTimers();
jest.setSystemTime(new Date(2025, 6, 10));

describe("createDatesLastlyWeek 유틸 함수", () => {
  it("createDatesLastlyWeek 사용 시 지난 일주일 범위의 날짜 배열을 생성한다.", () => {
    const dateListLastlyWeek = createDatesLastlyWeek();
    const expectedDateList = [
      new Date(2025, 6, 3),
      new Date(2025, 6, 4),
      new Date(2025, 6, 5),
      new Date(2025, 6, 6),
      new Date(2025, 6, 7),
      new Date(2025, 6, 8),
      new Date(2025, 6, 9),
    ];
    expect(expectedDateList).toHaveLength(7);
    expect(dateListLastlyWeek).toEqual(expectedDateList);
  });
});
