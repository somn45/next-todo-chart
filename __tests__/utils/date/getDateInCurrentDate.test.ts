import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";

describe("getStartOfPeriod", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 6, 10));
  });
  it("week 날짜 선택 시 현재 날짜가 포함된 금주 날짜 배열의 첫 번째 원소를 가져온다.", () => {
    const startOfCurrentWeek = getStartOfPeriod("week");
    expect(startOfCurrentWeek).toEqual(new Date(2025, 6, 6, 0, 0, 0));
  });
  it("month 날짜 선택 시 현재 날짜가 포함된 금월 날짜 배열의 첫 번째 원소를 가져온다.", () => {
    const startOfCurrentMonth = getStartOfPeriod("month");
    expect(startOfCurrentMonth).toEqual(new Date(2025, 6, 1, 0, 0, 0));
  });
  it("month 날짜 선택 시 현재 날짜가 포함된 금년 날짜 배열의 첫 번째 원소를 가져온다.", () => {
    const startOfCurrentYear = getStartOfPeriod("year");
    expect(startOfCurrentYear).toEqual(new Date(2025, 0, 1, 0, 0, 0));
  });
});

describe("getEndOfPeriod", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 6, 10));
  });
  it("week 날짜 선택 시 현재 날짜가 포함된 금주 날짜 배열의 마지막 원소를 가져온다.", () => {
    const startOfCurrentWeek = getEndOfPeriod("week");
    expect(startOfCurrentWeek).toEqual(new Date(2025, 6, 12, 23, 59, 0));
  });
  it("month 날짜 선택 시 현재 날짜가 포함된 금월 날짜 배열의 마지막 원소를 가져온다.", () => {
    const startOfCurrentMonth = getEndOfPeriod("month");
    expect(startOfCurrentMonth).toEqual(new Date(2025, 6, 30, 23, 59, 0));
  });
  it("year 날짜 선택 시 현재 날짜가 포함된 금년 날짜 배열의 마지막 원소를 가져온다.", () => {
    const startOfCurrentYear = getEndOfPeriod("year");
    expect(startOfCurrentYear).toEqual(new Date(2025, 11, 31, 23, 59, 0));
  });
});
