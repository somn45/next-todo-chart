import {
  getCurrentDateSharp,
  getCurrentWeekEndDate,
  getCurrentWeekStartDate,
} from "@/utils/date/getDateInCurrentDate";

describe("현재 날짜(금일, 금주, 금월) 관련 데이터를 가져오는 함수 목록 테스트", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 6, 10));
  });
  it("getCurrentDateSharp 함수를 실행하면 현재 날짜의 정각 시각을 가져온다.", () => {
    jest.setSystemTime(new Date(2025, 6, 10, 10, 30));
    const currentDate = getCurrentDateSharp();
    expect(currentDate).toEqual(new Date(2025, 6, 10));
  });

  it("getCurrentWeekStartDate 함수를 실행하면 현재 날짜에 포함된 금주의 시작일 00:00 날짜 데이터를 가져온다.", () => {
    const currentWeekStartDate = getCurrentWeekStartDate();
    expect(currentWeekStartDate).toEqual(new Date(2025, 6, 6));
    expect(currentWeekStartDate.getDay()).toEqual(0);
    expect(currentWeekStartDate.getHours()).toEqual(0);
    expect(currentWeekStartDate.getMinutes()).toEqual(0);
  });

  it("getCurrentWeekEndDate 함수를 실행하면 현재 날짜에 포함된 금주의 종료일 23:59 날짜 데이터를 가져온다.", () => {
    const currentWeekEndDate = getCurrentWeekEndDate();
    expect(currentWeekEndDate).toEqual(new Date(2025, 6, 12, 23, 59));
    expect(currentWeekEndDate.getDay()).toEqual(6);
    expect(currentWeekEndDate.getHours()).toEqual(23);
    expect(currentWeekEndDate.getMinutes()).toEqual(59);
  });
});
