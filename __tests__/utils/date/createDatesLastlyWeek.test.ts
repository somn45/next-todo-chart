import {
  createDatesLastlyWeek,
  getDatesLastlyPeriod,
} from "@/utils/date/createDatesLastlyWeek";

jest.useFakeTimers();
jest.setSystemTime(new Date(2025, 6, 10));

describe("createDatesLastlyWeek 유틸 함수", () => {
  it("week를 선택하면 최근 1주간의 날짜 배열을 반환해야 한다.", () => {
    const dateListLastlyWeek = getDatesLastlyPeriod("week");
    expect(dateListLastlyWeek).toHaveLength(7);
    expect(dateListLastlyWeek[0]).toEqual(new Date(2025, 6, 3));
    expect(dateListLastlyWeek[dateListLastlyWeek.length - 1]).toEqual(
      new Date(2025, 6, 9),
    );
  });
  it("month를 선택하면 최근 1달간의 날짜 배열을 반환해야 한다.", () => {
    const dateListLastlyMonth = getDatesLastlyPeriod("month");
    expect(dateListLastlyMonth).toHaveLength(30);
    expect(dateListLastlyMonth[0]).toEqual(new Date(2025, 5, 10));
    expect(dateListLastlyMonth[dateListLastlyMonth.length - 1]).toEqual(
      new Date(2025, 6, 9),
    );
  });
  it("year를 선택하면 최근 1년간의 날짜 배열을 반환해야 한다.", () => {
    const dateListlastlyYear = getDatesLastlyPeriod("year");
    expect(dateListlastlyYear).toHaveLength(365);
    expect(dateListlastlyYear[0]).toEqual(new Date(2024, 6, 10));
    expect(dateListlastlyYear[dateListlastlyYear.length - 1]).toEqual(
      new Date(2025, 6, 9),
    );
  });
});
