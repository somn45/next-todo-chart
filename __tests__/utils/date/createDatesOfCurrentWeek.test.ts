import {
  createDatesOfCurrentMonth,
  createDatesOfCurrentWeek,
  createDatesOfCurrentYear,
} from "@/utils/date/createDatesOfCurrentWeek";

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

  it("createDatesOfCurrentMonth 실행 시 현재 날짜를 기준으로 이번 달에 해당하는 날자 배열을 생성한다", () => {
    const currentMonth = createDatesOfCurrentMonth();
    expect(currentMonth).toHaveLength(30);
    expect(currentMonth[0]).toEqual(new Date(2025, 6, 1));
    expect(currentMonth[currentMonth.length - 1]).toEqual(
      new Date(2025, 6, 30),
    );
  });

  it("createDatesOfCurrentYear 실행 시 현재 날짜를 기준으로 이번 년도에 해당하는 날짜 배열을 생성한다", () => {
    const currentYear = createDatesOfCurrentYear();
    expect(currentYear).toHaveLength(365);
    expect(currentYear[0]).toEqual(new Date(2025, 0, 1));
    expect(currentYear[currentYear.length - 1]).toEqual(new Date(2025, 11, 31));
  });

  it("현재 날짜가 윤년에 해당한다면 366길이의 날짜 배열을 생성한다.", () => {
    jest.setSystemTime(new Date(2028, 2, 1));
    const currentYear = createDatesOfCurrentYear();
    expect(currentYear).toHaveLength(366);
    expect(currentYear[0]).toEqual(new Date(2028, 0, 1));
    expect(currentYear[currentYear.length - 1]).toEqual(new Date(2028, 11, 31));
  });
});
